# Financial Lab 4.1.9.3 Test Report

## Target regression

Verify that deleting an approved paycheck does not leave a phantom paycheck in future-bill reserve math.

## Test

1. Deploy 4.1.9.3 and fully close/reopen the installed PWA.
2. Keep the recurring **Command center test** bill at **$300 due Oct 16, 2026**.
3. With the approved Oct 2 test paycheck deleted and no active check entered, open Budget Lab → Prepare Now.
4. Confirm the bill shows:
   - **$0.00 already protected**
   - **$300.00 left**
   - **3 paychecks including this one**
   - **Protect this check: $100.00**
5. Start/enter the Oct 2 → Oct 9 cycle and rebuild the $700 test plan.
6. Confirm the same bill still uses **3 total checks** (Oct 2, Oct 9, Oct 16) and **$100.00** for the current-check reserve.
7. Approve the plan, verify Execution Mode, then delete the approved paycheck again.
8. Confirm Reserve Memory/savings roll back and the bill returns to **$0 protected / 3 checks / $100 per check**.

## Pass criteria

- No phantom fourth paycheck appears after rollback.
- Reserve target is $100.00, not $75.00, for the regression case.
- Active/prepared cycles still count the current paycheck exactly once.
- No unrelated recurring bills, debts, savings goals, expenses, history, calendar data, or profile settings are removed.
