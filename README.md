# Financial Lab v4.1.17 — Guided Lab Setup Foundation

Builds directly on v4.1.16 Payday Landing + Amount Reconciliation and preserves the locked Oct 2 payday test. This release adds a small, additive `setup` metadata object that is merged automatically with existing saved data; existing bills, debts, savings, expenses, approved history, Reserve Memory, and payday state are preserved.

## What changed

- Rebuilds **Start Here** as a guided first-time Financial Lab setup instead of only an app walkthrough.
- Separates setup into **required** and **recommended** information.
- Required step 1 confirms **money available today**. A real $0 balance is valid and can be explicitly confirmed.
- Required step 2 captures **pay frequency, income pattern, expected next check, and next payday**.
- Setup income is planning information only. Saving it does **not** mark a paycheck as landed, funded, or approved.
- Bills, debt, savings, and spending can be added immediately or marked **Skip for now**.
- Skipped information remains visibly incomplete so Financial Lab never treats missing data as a real $0 balance or “no debt / no bills.”
- Adds a **Lab Readiness** summary and a Dexx recommendation for the next missing setup area.
- **Enter My Lab — Finish Later** unlocks after the two essential steps are complete.
- Existing users with a real active payday plan are recognized as already having the two essential money/income steps, so the update does not force them to re-enter the current cycle.
- Keeps the Progressive Unlock rule: required steps unlock the Lab; recommended information improves completeness without becoming a wall.

## Current Sep 29 test state

The existing Oct 2 plan must remain untouched: $700 planned paycheck, $170 planned protected, $530 planned TRUE Safe-to-Spend, 0 moves funded, and `PAYCHECK LANDS OCT 2` still locked.

For the current test data, **Start Here** should recognize the active Oct 2 plan as satisfying the two required setup steps. Any missing bills/debt/savings/spending areas should show as recommended or optional rather than silently assumed to be zero.

## Deployment

Upload these six files together, wait for GitHub Pages to deploy, fully close the installed PWA, then reopen it.
