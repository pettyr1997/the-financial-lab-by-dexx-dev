# Financial Lab v4.1.20 — Money Dates Bridge

Built directly on v4.1.19. This release connects the Bill Calendar / Forecast side of Financial Lab to the Dexx Money Journey so dates explain *why* a step is blocked or protected. No financial-data schema changes and no payday math changes.

## What changed

- Adds **Money Dates Bridge** at the top of Calendar Lab.
- Connects the current Money Journey gate to its real calendar date.
- Shows three quick signals: Current Gate, Next Bill, and Next Payday.
- Adds a **Why This Date Matters** explanation using the active payday plan.
- When the active plan contains future-bill reserve details, Dexx explains which bill is driving the current-check reserve and how much is being protected.
- Highlights the current journey-gate date in the month grid.
- Tags the matching upcoming payday as **CURRENT GATE**.
- Tags future bills receiving reserve protection as **PROTECTED**.
- Tags the following payday as **NEXT CYCLE**.
- Keeps the Bill Calendar as the date view while Money Journey remains the step-by-step action view.

## Current Sep 29 / Oct 2 test expectation

With the existing approved test cycle still intact:

- Current Gate should read **Paycheck lands Oct 2**.
- The bridge should explain that the planned $700 remains blocked until payday and must be reconciled before planned protection / runway can activate.
- Oct 2 should be visually highlighted as the current journey gate in the calendar.
- The Oct 2 upcoming-money-date row should carry **CURRENT GATE**.
- Oct 9 should be identified as the next payday / next cycle boundary.
- If the active $100 reserve is tied to the saved future bill, that bill should be tagged **PROTECTED** and the bridge should explain the reserve connection.

## Preserved behavior

- v4.1.19 Dexx Money Journey / Progressive Unlock System.
- v4.1.18.1 unknown ≠ zero Health Score clarity.
- Guided Lab Setup and Lab Readiness Intelligence.
- v4.1.16 actual-paycheck reconciliation.
- Payday Landing Guard and scheduled-vs-funded separation.
- Forecast math, Reserve Memory, Weekly Runway, Pace Coach, Reports, history, and recovery tools.
