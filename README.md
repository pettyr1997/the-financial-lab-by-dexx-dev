# Financial Lab 4.1.0 — Expense Manager + Spending Memory

Built on the stable 4.0.9.1 Front Door release.

## Added
- New Spending Lab / Expense Manager.
- Record unlimited expenses with name, amount, category, date, and optional note.
- Expense records are tied to the active paycheck cycle.
- TRUE Safe-to-Spend decreases automatically as flexible expenses are recorded.
- Starting Safe-to-Spend, Spent This Cycle, and Remaining are shown separately.
- Spending meter shows how much of the flexible allowance has been used.
- Dexx warns at 80%+ usage and when spending goes over the allowance.
- Edit and delete expenses.
- Expenses appear in the financial timeline.
- More → Add Expense now opens the full Expense Manager.

## Spending Memory rule
Expenses reduce only flexible TRUE Safe-to-Spend. They do not reduce protected bill reserves, Savings Goal balances, or Debt Manager balances.

When paycheck dates move to a new cycle, prior-cycle expenses remain saved but stop reducing the new paycheck's TRUE Safe-to-Spend.

## Preserved
- Front Door navigation isolation.
- Start Here walkthrough/mobile fixes.
- Savings Goals.
- Debt Manager.
- Reserve Memory.
- Bills Manager.
- Payday Mode.
- Existing local browser data.
