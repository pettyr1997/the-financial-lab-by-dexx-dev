# Financial Lab 4.1.0.7 — Date Safety Hotfix

Built directly on the now-confirmed working 4.1.0.6 Direct Payday Control.

## Root cause confirmed
4.1.0.6 proved the Payday Plan button works and the plan saves successfully.

The remaining failure was:
`Plan SAVED, but screen refresh failed: Invalid Date`

That means legacy/malformed saved date data was crashing `render()`.

## Fixed
- Rebuilt the shared date parser so invalid dates return `null` instead of becoming JavaScript `Invalid Date` objects.
- `iso()` can no longer throw on malformed dates.
- Bill recurrence generation skips invalid bill due dates instead of crashing the whole app.
- Invalid Savings Goal target dates behave like no deadline.
- Invalid Debt due dates display `TBD`.
- Invalid Bill due dates display `TBD`.
- Invalid Expense dates display safely.
- Financial Timeline filters invalid dates.
- Paycheck date fields sanitize persisted values before displaying.
- Existing expense `cycleId` values now survive migration/reload.

## Preserved
- 4.1.0.6 direct Payday Plan button and visible diagnostics.
- Stable navigation.
- Expense Manager / Spending Memory.
- Paycheck-cycle binding.
- Reserve Memory.
- Savings Goals.
- Debt Manager.
- Bills Manager.
- Front Door.
- Existing local data.

## Expected test
Build the same plan again.

The plan should now render instead of showing `Invalid Date`.

Then check:
- Spent this cycle
- TRUE Safe-to-Spend
