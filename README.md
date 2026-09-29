# Financial Lab 4.1.15 — Payday Landing Guard

Builds on 4.1.14 and fixes the difference between an approved future paycheck plan and money that has actually landed.

## What changed
- A future paycheck can be approved and planned without being treated as funded today.
- Future reserve and savings allocations remain **planned** until payday.
- Existing pre-4.1.15 future plans are normalized once: early Reserve Memory / savings contributions are rolled back and returned to planned status.
- Payday Execution Mode shows future moves as **SCHEDULED**, not DONE.
- Before payday, the landing button is disabled and shows the scheduled check date.
- On/after payday, **CONFIRM PAYCHECK LANDED** activates funding and records Reserve Memory + savings contributions.
- Laboratory and Payday Command Center distinguish **PLANNED PROTECTED** from live funded protection.
- The Weekly Runway / Pace Coach remains pre-cycle until payday.

## Current Sep 29 → Oct 2 test expectation
With the approved $700 Oct 2 plan:
- Available today stays $0.00.
- Upcoming check stays $700.00.
- Planned protected stays $170.00.
- Planned TRUE Safe-to-Spend stays $530.00.
- Execution Mode should show `0 moves funded` and SCHEDULED tasks.
- The button should read `PAYCHECK LANDS OCT 2` and remain disabled before Oct 2.
- Reserve Memory / savings should not claim the future paycheck was funded early.

No recurring bills, debt accounts, expenses, calendar data, history, or profile settings are intentionally removed by this update.
