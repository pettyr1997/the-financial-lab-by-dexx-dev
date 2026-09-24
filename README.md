# Financial Lab 4.1.6 — Forecast Engine + Bill Calendar

Builds on 4.1.5.2 without changing the saved financial-data schema.

## Added
- Calendar Lab with a real month grid for recurring bill occurrences.
- Estimated payday markers based on the saved pay frequency and next payday.
- 30-day Forecast Engine using recurring bills, latest entered paycheck, and savings rate.
- Forecast KPIs for bills, estimated income, estimated savings target, and room after bills + savings.
- Upcoming Money Dates list covering the next 45 days.
- Bill Calendar quick action under More and a Forecast Engine launch card in Reports.
- Paid bill occurrences remain visible as paid on the calendar instead of disappearing.

## Forecast rules
- Income is explicitly labeled as an estimate and uses the latest entered paycheck for each projected payday.
- Variable income remains an estimate; Financial Lab does not treat forecast income as guaranteed.
- Forecast does not change Reserve Memory, Savings Goal balances, approved history, expenses, debts, or the active payday plan.
- Existing localStorage + IndexedDB memory schema remains unchanged.

## Test target
1. Deploy over 4.1.5.2.
2. Open the already-installed Home Screen app and confirm it updates without reinstalling.
3. Confirm existing Financial Lab data remains.
4. Open More → Bill Calendar.
5. Verify recurring bills appear on the correct dates and estimated paydays show green markers.
6. Move forward/back one month and verify recurring bill dates continue correctly.
7. Open Reports and verify the 30-day forecast card matches Calendar Lab.
