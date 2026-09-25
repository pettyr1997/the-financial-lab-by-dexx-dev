# Financial Lab 4.1.7.3 — Test Report

## Safety & Recovery test plan

1. **Payday advance undo** — Start the next paycheck cycle, verify dates advance, then tap Undo and verify the previous pay date / next payday return.
2. **Cancel guard** — Tap Start Next Paycheck and cancel the confirmation. Verify no recovery point or date change is created.
3. **Selective reset** — Add temporary test data, reset only that area, confirm unrelated bills/debts/savings/history remain, then Undo and verify the test data returns.
4. **Restore selected state** — Make two small saved changes, choose an older safe state, restore it, and verify Financial Lab returns to that state. Confirm a new “Before recovery restore” point exists.
5. **Reserve Memory integrity** — With an approved test plan that contains bill reserves, undo/restore and verify Reserve Memory and approved history return together without duplicate contributions.
6. **Recent Activity** — Confirm saved changes and recovery actions appear in Recent Activity.
7. **Full reset guard** — Open Full Financial Lab Reset, enter anything except `RESET`, and verify nothing is erased. Do not complete a real full reset unless using disposable test data.
8. **Persistence** — Fully close/reopen the installed PWA and confirm current financial data plus recovery points remain available.
9. **Calendar regression** — Verify Bill Calendar, payday markers, 30-day forecast, and Upcoming Money Dates still render after recovery operations.
10. **4.1.7.2 regression** — With an upcoming prepared paycheck and $0 entered, verify the launchpad still shows that upcoming paycheck as Next Check Date rather than skipping ahead.

## Expected result

A mistaken saved action can be recovered without manually reconstructing the user's financial setup, while destructive resets require explicit confirmation and remain locally undoable as long as recovery history has not been cleared by browser/app data removal.
