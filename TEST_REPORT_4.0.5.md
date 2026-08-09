# Financial Lab 4.0.5 Test Report

- [PASS] JavaScript syntax check.
- [PASS] Original `financial-lab-v3-data` localStorage key preserved.
- [PASS] Dynamic Bills Manager retained with unlimited bill count behavior.
- [PASS] Mobile Bills Manager layout from 4.0.3.1 retained.
- [PASS] Priority order is Pay Now -> Bills Reserve -> Savings -> Extra Debt -> TRUE Safe to Spend.
- [PASS] Future recurring bills are assigned a current-paycheck reserve share based on paychecks remaining before due date.
- [PASS] Reserve shortfall can reduce savings/debt rather than overstating safe-to-spend.
- [PASS] Payday history stores reserve target and reserve details.
- [PASS] Service-worker cache bumped to 4.0.5.

## Scenario tests
- $700 paycheck + $50 due-now bill + $1,200 bill due Aug 28 with weekly pay: Dexx protects $300 now (1 of 4 paycheck shares), saves $70, and reports $280 TRUE safe to spend.
- $700 paycheck + $50 due-now bill + $1,200 bill due Aug 19: Dexx protects $600 now (1 of 2 paycheck shares), saves only the remaining $50, and reports $0 TRUE safe to spend.
- $700 paycheck + only a $50 due-now bill: no future reserve is created, $70 goes to savings, and $580 is safe to spend.
