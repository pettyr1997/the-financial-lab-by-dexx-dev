# Financial Lab 4.1.7.3 — Safety & Recovery Foundation

Builds on 4.1.7.2 without changing the existing financial-data schema.

## Added

- **Undo Last Change** using short-term local recovery points created before saved Financial Lab changes.
- **Restore Previous Safe State** with a selectable list of recent recovery points.
- Restoring a safe state automatically saves the current state first, so the restore itself can be reversed.
- **Selective Reset** controls for Current Paycheck, Expenses, Bills + Reserve Memory, Debt Accounts, and Savings Goals.
- **Full Financial Lab Reset** requires typing `RESET` plus a second confirmation and creates an undo point first.
- **Recent Activity** shows the latest protected changes and recovery actions.
- Payday-cycle advances, approved plans, deletes, debt payments, savings moves, and other saved changes now participate in the recovery layer.

## Safety design

Recovery snapshots store the **whole Financial Lab data state** before a saved change. That keeps linked values—such as Reserve Memory, approved paycheck history, savings balances, bill status, and active-cycle dates—together when undoing or restoring instead of trying to reverse individual numbers manually.

Recovery history is stored separately from the existing `financial-lab-v3-data` record, so this release does not require a migration of the user's financial-data schema.

## Preserved

4.1.7.2 payday-date logic, Payday Continuity Guard, recurring bills, debts, savings goals, Reserve Memory, expenses, approved history, Forecast Engine, Bill Calendar, dual-device Memory Guard, and JSON backup/restore remain in place.
