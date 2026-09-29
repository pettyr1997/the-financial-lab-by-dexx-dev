# Financial Lab 4.1.16 Test Report

## Feature under test
Payday Landing + Amount Reconciliation

## Pre-payday test — Sep 29, 2026
Expected with the existing Oct 2 approved plan:
- Payday Command Center remains **Plan scheduled**.
- Planned paycheck remains $700.
- Planned protected remains $170.
- Planned TRUE Safe-to-Spend remains $530.
- Payday Execution Mode remains **0 moves funded**.
- Reserve, savings, and spending tasks remain **SCHEDULED**.
- `PAYCHECK LANDS OCT 2` remains disabled.
- Payday Check-In is hidden before Oct 2.

## Natural payday test — Oct 2, 2026
1. Confirm the locked payday control transitions to **Payday Check-In**.
2. Enter $700 actual and tap **CHECK AMOUNT + RECALCULATE**.
   - Difference should be $0.00.
   - Updated protected should remain $170.
   - Updated TRUE Safe-to-Spend should remain $530.
3. Do not activate until the preview is verified.
4. Later variance tests: use an amount below and above $700 and verify Dexx recalculates before funding.
5. A variance that creates an immediate-bill shortfall must block activation and route the plan back for review.

## Safety invariant
No reserve-memory or savings contribution may be recorded merely because the calendar reached payday. Funding occurs only after the user enters the actual deposit, reviews the recalculated result, and activates the reconciled payday.
