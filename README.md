# Financial Lab 4.1.7 — Payday Continuity

Builds on 4.1.6.1 without changing the saved financial-data schema.

## Added
- **Start Next Paycheck** launchpad in Budget Lab.
- Automatically prepares the next check date and following payday from the saved pay schedule.
- Uses the previous cycle as an anchor when available, so weekly/biweekly continuity does not require re-entering dates.
- For steady-income profiles, the latest check amount can carry forward as a starting value; variable-income profiles intentionally start the amount at $0.
- Keeps recurring bills, debts, savings goals, Reserve Memory, expenses, and approved paycheck history intact.
- Resets only cycle-specific planning state and weekly mission progress.

## Fixed
- Clearing/deleting the active paycheck now correctly clears `currentBalance` instead of the unused legacy `balance` field.

## Safety
- Starting the next paycheck does **not** approve a plan or write new Reserve Memory.
- Reserve Memory and Savings Goal contributions still change only when **Approve This Payday Plan** is tapped.
- No saved financial-data schema change.

## Test target
1. Deploy over 4.1.6.1 and reopen the installed Home Screen app.
2. Open Budget Lab and confirm the **4.1.7 Payday Continuity** card appears.
3. With a weekly Friday profile, confirm the suggested dates are the next Friday and the Friday after it.
4. Tap **Start Next Paycheck** and confirm check dates populate while bills/debts/savings remain saved.
5. Confirm a variable-income profile leaves paycheck amount blank/zero.
6. Enter a temporary check amount and build (do not approve unless using real data).
