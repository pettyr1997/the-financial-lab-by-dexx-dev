# Financial Lab 4.0.5.1 — Future Bill Pipeline Hotfix

This DEV release fixes a gap found during mobile testing: farther-out recurring bills (for example rent due Aug 31) were saved correctly but could fall outside the short reserve window and disappear from the Payday Plan.

## What changed
- Dexx now plans across several future paychecks, not only the 14-day reserve window.
- Budget Lab separates **PAY NOW** from **PREPARE NOW**.
- Future bills show their full amount, due date, paychecks remaining, and the amount Dexx recommends protecting from the current check.
- All protected reserve money is deducted before savings, debt, and TRUE Safe-to-Spend.
- Existing Bills Manager data and `financial-lab-v3-data` storage are preserved.

Upload all files in this ZIP directly over the current files in the DEV repository.
