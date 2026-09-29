# Financial Lab 4.1.10 — Weekly Runway

Builds on 4.1.9.3 without changing the existing Financial Lab financial-data schema.

## New — Weekly Runway

Once a payday plan is approved, Payday Command Center now turns TRUE Safe-to-Spend into a live weekly runway:

- **Days Left** shows how much of the paycheck cycle remains before the next payday.
- **Safe Remaining** uses the live TRUE Safe-to-Spend amount after recorded expenses.
- **Daily Runway** divides the remaining safe money across the remaining cycle days so the user can see an even-spending reference point.
- **Spending Pace** compares flexible money used with how far the paycheck cycle has progressed.
- Dexx labels the cycle **Ready**, **Ahead**, **On pace**, **Watch pace**, or **Limit reached** without changing the approved allocation.

## Future-cycle protection

If a plan is approved before its check date during testing or early preparation, Weekly Runway does not pretend the cycle has already started. It shows the start date and keeps spending pace in a ready state until the check date arrives.

## Payday rollover signal

When the next payday is reached, Weekly Runway shows that the prior runway is complete and directs the user to start the next paycheck cycle rather than continuing to divide old safe-to-spend money.

## Preserved

4.1.9.3 reserve-schedule cleanup, Payday Command Center, Payday Execution Mode, approved-paycheck deletion/rollback, TRUE Safe-to-Spend, Reserve Memory, savings contributions, recurring bills, Bill Calendar, Forecast Engine, Payday Continuity/Guard, expenses, reports, recovery controls, and existing saved data remain preserved.
