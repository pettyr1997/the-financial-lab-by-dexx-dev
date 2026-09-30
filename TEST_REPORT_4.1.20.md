# Financial Lab v4.1.20 — Test Report

## Release focus
Money Dates Bridge: connect Calendar Lab to the real Progressive Unlock / Money Journey state without changing payday calculations or saved-data schema.

## Static checks completed
- Built directly from the deployed v4.1.19 six-file source package.
- JavaScript syntax check passed with `node --check`.
- App/cache asset version bumped to 4.1.20.
- No financial-data schema changes.
- No changes to paycheck allocation, reserve calculation, savings calculation, TRUE Safe-to-Spend math, or reconciliation math.

## Live PWA checks to run
1. Reopen installed PWA after GitHub Pages deploy.
2. Verify existing Oct 2 plan is unchanged: $700 planned / $170 planned protected / $530 planned safe.
3. Open **Bill Calendar**.
4. Verify Money Dates Bridge shows **Paycheck lands Oct 2** as Current Gate.
5. Verify Oct 2 is highlighted in the month grid as the journey gate.
6. Verify Upcoming Money Dates tags Oct 2 as **CURRENT GATE**.
7. Verify Oct 9 is identified as the next cycle / next payday.
8. Verify any future bill receiving the active plan's reserve contribution is tagged **PROTECTED** and the bridge explains the reserve connection.
9. Return to Laboratory and verify Money Journey still shows Steps 1–2 complete and Step 3 blocked until Oct 2.

## Expected result
Calendar answers **when**, Money Journey answers **what next**, and the Money Dates Bridge explains **why that date matters** — without unlocking or funding anything early.
