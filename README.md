# Financial Lab 4.1.11 — Runway Pace Coach

Builds on 4.1.10.1 without changing the existing Financial Lab financial-data schema.

## Added — Dexx Runway Pace Coach

Weekly Runway now does more than show the remaining balance. Dexx compares actual flexible spending with where the user is in the paycheck cycle and explains whether the week is ahead of pace, on pace, or moving too fast.

- **Calendar Pace** shows how much of the cycle's flexible budget could reasonably be used by the current paycheck day.
- **Pace Gap** shows the dollar cushion under the calendar pace or the amount spending is running over it.
- Coach states include **Ready**, **Ahead of pace**, **On pace**, **Watch spending**, **Spending too fast**, **Limit reached**, and **Cycle complete**.
- The coach gives a plain-language action message based on the current pace and remaining TRUE Safe-to-Spend.
- Daily Runway continues to recalculate from the money and days remaining.

## Payday-day pacing fix

Pace is now day-based instead of treating the beginning of payday as 0% of the cycle. For a weekly Oct 2 → Oct 9 cycle, Oct 2 is day 1 of 7 and the calendar pace is about 14% rather than 0%. This avoids labeling normal payday spending as too fast simply because it happened on the first day.

The next payday remains exclusive to the current cycle and belongs to the next paycheck cycle, matching the 4.1.10.1 expense-date guard.

## Reference behavior

For an approved Oct 2 → Oct 9 cycle with $530 TRUE Safe-to-Spend:

- Before Oct 2: Pace Coach is **Ready**, spending pace has not started, and pre-cycle expenses do not count.
- Oct 2: calendar pace is about **14%** (day 1 of 7).
- Oct 5: calendar pace is about **57%** (day 4 of 7).
- Oct 8: calendar pace is **100%** (day 7 of 7).
- Oct 9: the old runway is complete; the next paycheck cycle should take over.

## Preserved

4.1.10.1 Cycle-Date Expense Guard, Payday Command Center, Payday Execution Mode, Reserve Memory, savings contributions, recurring bills, Bill Calendar, Forecast Engine, Payday Continuity/Guard, reports, recovery controls, approved-paycheck rollback, and existing saved financial data remain preserved.
