# Financial Lab 4.1.0.2 — Paycheck Cycle Binding

Built directly on 4.1.0.1 Spending Memory Integration Hotfix.

## Fixed
- Every expense can now remember the exact paycheck cycle it belongs to.
- Current-cycle spending is matched using a stable paycheck cycle ID instead of relying only on expense dates.
- Rebuilding a plan no longer makes cycle-bound spending disappear.
- Expenses saved before a paycheck cycle exists become **Pending Spending**.
- Building the next Payday Plan automatically attaches Pending Spending to that paycheck cycle.
- Spending Lab shows how much Pending Spending is waiting.
- Existing older expense records still have a date-based fallback so prior data is not lost.

## Expected test
$120 paycheck
- $12 savings
- $20 Gas expense
= $88 TRUE Safe-to-Spend

The Payday Plan should show:
- Spent this cycle: $20.00
- TRUE Safe-to-Spend: $88.00

## Preserved
- Expense history/edit/delete
- Reserve Memory
- Savings Goals
- Debt Manager
- Bills Manager
- Front Door navigation isolation
- Existing local browser data
