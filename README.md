# Financial Lab 4.1.10.1 — Cycle-Date Expense Guard

Builds on 4.1.10 without changing the existing Financial Lab financial-data schema.

## Fixed — expenses now belong to the correct paycheck cycle

Financial Lab now uses the expense date as a hard guard before flexible spending can reduce a paycheck's TRUE Safe-to-Spend.

- A future paycheck is no longer reduced by an expense dated before that paycheck arrives.
- An expense can bind to the active paycheck cycle only when its date falls inside that cycle.
- Previously mis-bound expenses are ignored by the wrong cycle even if an older saved `cycleId` points there.
- Editing an expense date re-evaluates which cycle owns it instead of blindly keeping the old cycle assignment.
- Pending/unbound expenses attach only when their date actually belongs to the paycheck cycle being built.
- The next payday is treated as the start of the next cycle, preventing one expense from belonging to two adjacent weekly cycles.

## Reference test

For an approved **Oct 2 → Oct 9** paycheck with **$530.00 TRUE Safe-to-Spend**:

- A **$10 expense dated Sep 29** must leave the Oct 2 cycle at **$530.00 / $0.00 spent**.
- A **$10 expense dated Oct 2** must change the Oct 2 cycle to **$520.00 / $10.00 spent**.
- Protected money remains unchanged.
- Weekly Runway must read the same cycle-filtered spending total as Payday Command Center.

## Preserved

4.1.10 Weekly Runway, Payday Command Center, Payday Execution Mode, Reserve Memory, savings contributions, recurring bills, Bill Calendar, Forecast Engine, Payday Continuity/Guard, reports, recovery controls, approved-paycheck rollback, and existing saved financial data remain preserved.
