# Financial Lab 4.1.10.1 — Test Report

## Build checks

- `app.js` passes `node --check` syntax validation.
- HTML/CSS/JS/service-worker asset versions are bumped to 4.1.10.1.
- No financial-data schema fields were added or removed.

## Cycle-Date Expense Guard checks

Reference cycle: **Oct 2, 2026 → Oct 9, 2026**.

- Sep 29 expense: outside cycle; must not count.
- Oct 1 expense: outside cycle; must not count.
- Oct 2 expense: inside cycle; must count.
- Oct 8 expense: inside cycle; must count.
- Oct 9 expense: next-payday boundary; must not count in the Oct 2 cycle.
- A saved cycle ID cannot override an expense date that is outside the cycle.
- An unbound expense is attached during plan build only if its date is inside the active cycle.
- Editing an expense from an in-cycle date to an out-of-cycle date clears the active-cycle ownership.

## Live iPhone/PWA test

Keep the existing **$10 Sep 29 pre-cycle test expense** saved.

1. Deploy 4.1.10.1 and fully reopen the installed PWA.
2. Confirm the header shows **4.1.10.1 PAYDAY COMMAND CENTER**.
3. With the Oct 2 → Oct 9 test plan active, confirm TRUE Safe-to-Spend returns to **$530.00** and **Spent** returns to **$0.00**.
4. Confirm Weekly Runway also shows **$530.00 Safe Remaining** and **$75.71 Daily Runway** before the cycle starts.
5. Add a second **$10 expense dated Oct 2**. Confirm TRUE Safe-to-Spend becomes **$520.00** and Spent becomes **$10.00**.
6. Delete the Oct 2 test expense and confirm the Oct 2 cycle returns to **$530.00 / $0.00 spent**.
7. Delete the Sep 29 pre-cycle test expense after the test is complete.
