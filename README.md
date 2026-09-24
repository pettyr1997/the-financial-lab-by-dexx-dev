# Financial Lab 4.1.6.1 — Calendar Amount Display Polish

Builds on 4.1.6 without changing the saved financial-data schema.

## Polished
- Calendar bill totals now use a compact display so narrow iPhone day cells do not truncate `$100.00` into `$10...`.
- Amounts under $1,000 display as rounded whole dollars (for example `$100`).
- Larger calendar-only totals use compact labels such as `$1.2k` while the Forecast Engine and Upcoming Money Dates keep full currency precision.
- No forecast math, payday planning, Reserve Memory, expenses, debts, savings, or approved history logic was changed.

## Test target
1. Deploy over 4.1.6.
2. Open the installed Home Screen app and confirm the update arrives without reinstalling.
3. Add a temporary $100 recurring bill to a visible calendar date.
4. Confirm the calendar cell displays `$100` instead of `$10...`.
5. Confirm Forecast Engine still shows the full `$100.00` and its totals remain unchanged.
6. Delete the temporary bill after the display test.
