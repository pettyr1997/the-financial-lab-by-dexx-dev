# Financial Lab 4.1.0.1 — Spending Memory Integration Hotfix

Built directly on 4.1.0 Expense Manager + Spending Memory.

## Fixed
- Budget Lab now reads saved expenses from the actual paycheck cycle entered in Check Details.
- Spending Lab and Budget Lab use the same paycheck-cycle dates.
- Current-cycle expenses reliably subtract from TRUE Safe-to-Spend.
- Expense save messaging no longer claims a safe-to-spend update when no active paycheck plan exists.
- Payday Plan now shows a separate **Spent this cycle** line so the deduction is visible.

## Test example
$120.00 paycheck
- $12.00 savings
- $20.00 recorded expense
= $88.00 TRUE Safe-to-Spend

## Preserved
- Expense history/edit/delete.
- Reserve Memory.
- Savings Goals.
- Debt Manager.
- Bills Manager.
- Front Door navigation isolation.
- Existing local browser data.
