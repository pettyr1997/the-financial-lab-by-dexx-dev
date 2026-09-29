# Financial Lab 4.1.17 Test Report

## Feature under test
Guided Lab Setup Foundation

## Existing-user regression test — Sep 29, 2026
1. Open Budget Lab first.
   - Oct 2 payday remains **Plan scheduled**.
   - Planned paycheck remains $700.
   - Planned protected remains $170.
   - Planned TRUE Safe-to-Spend remains $530.
   - Payday Execution Mode remains **0 moves funded**.
   - `PAYCHECK LANDS OCT 2` remains locked.
2. Open **More → Start Here**.
   - Guided Lab Setup appears.
   - Money available today is recognized as ready from the existing active money context even when the real balance is $0.
   - Income & next payday is recognized as ready from the existing Oct 2 plan.
   - Expected check should show $700 and upcoming payday should show Oct 2.
   - Missing recommended areas are labeled Recommended/Optional, not treated as real zero balances.
   - **ENTER MY LAB — FINISH LATER** is enabled because the two essentials are satisfied.

## Fresh-user behavior to verify later
- A brand-new user cannot enter the Lab until Money Today and Income/Next Payday are confirmed.
- $0.00 is accepted as a valid Money Today amount.
- Bills, debt, savings, and spending each offer **Skip for now**.
- Skipping does not mark the area complete; it shows **Skipped · add later**.
- Saving expected income does not fund or activate a payday plan.

## Safety invariant
Guided setup must never convert expected future income into money available today. Missing recommended data must remain visibly incomplete so Financial Lab does not falsely assume the user has no bills, no debt, or no savings needs.
