# Financial Lab 4.1.12 — Live Pace Action Guide

Builds on 4.1.11 without changing the existing Financial Lab financial-data schema.

## Added — Live Pace Action

Dexx Pace Coach now turns the calendar comparison into a concrete same-day action. The new **LIVE PACE ACTION** panel shows how much room remains before flexible spending reaches the current day’s calendar pace.

- Before payday: clearly says the live target starts on the check date.
- During the cycle and under pace: shows the dollar amount that can still be used before reaching today’s calendar pace.
- Over pace: shows **$0.00** and tells the user how far spending is over today’s pace.
- At the flexible limit: shows **$0.00** and tells the user to hold new flexible spending.
- After the cycle: prompts the user to start the next paycheck cycle.
- The guide explicitly says this is a pacing target, **not extra money** beyond TRUE Safe-to-Spend.

## Fixed — Watch-spending wording

4.1.11 correctly detected faster-than-calendar spending, but the Watch Spending coach sentence could say the user was “ahead” of pace. 4.1.12 now correctly says the user is **over** the calendar spending pace.

## Example

For an Oct 2 → Oct 9 cycle with $530 TRUE Safe-to-Spend, Oct 2 calendar pace is about $75.71. If $20 has been spent in the cycle, LIVE PACE ACTION shows about **$55.71** of room before reaching that day’s pace. If $90 has been spent, it shows **$0.00** and explains that spending is about $14.29 over pace.

## Preserved

4.1.11 Pace Coach, 4.1.10.1 Cycle-Date Expense Guard, Payday Command Center, Payday Execution Mode, Reserve Memory, savings contributions, recurring bills, Bill Calendar, Forecast Engine, Payday Continuity/Guard, reports, recovery controls, approved-paycheck rollback, and existing saved financial data remain preserved.
