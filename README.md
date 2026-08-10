# Financial Lab 4.1.0.3 — Navigation Recovery + Cycle Binding

Built from the stable 4.1.0.1 release.

## Why this release exists
4.1.0.2 introduced a navigation regression. 4.1.0.3 rolls back to the last build where all Lab links worked and reapplies only the minimum Spending Memory changes.

## Fixed
- Restored the exact 4.1.0.1 navigation/event system.
- No changes were made to `show()`, bottom navigation, Front Door routing, or data-go link handling.
- Expenses can now carry a stable paycheck-cycle ID.
- New expenses attach to the current paycheck cycle when one exists.
- Expenses saved before a cycle exists remain unbound/pending.
- Building a Payday Plan attaches unbound expenses to that exact paycheck cycle.
- Current-cycle expense lookup uses cycle ID first, with date fallback for older records.
- TRUE Safe-to-Spend continues to subtract expenses belonging to the active cycle.

## Expected test
With:
- Paycheck $120
- Savings $12
- Gas expense $20

Budget Lab should show:
- Spent this cycle: $20
- TRUE Safe-to-Spend: $88

## Preserved
- Front Door navigation isolation
- All bottom navigation links
- Expense Manager
- Reserve Memory
- Savings Goals
- Debt Manager
- Bills Manager
- Existing local browser data
