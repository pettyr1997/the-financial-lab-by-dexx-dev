# Financial Lab v4.1.18.1 — Health Score Clarity

Polish patch built directly on v4.1.18 Lab Readiness Intelligence. No financial-data schema changes and no payday math changes. The locked Oct 2 reconciliation test remains intact.

## What changed

- Unknown debt no longer renders as `0/20` in the Financial Health Score. It displays `—/20` until the user adds debt accounts or explicitly confirms they have no debt.
- Keeps the debt explanation visible so Dexx tells the user exactly how to complete that signal.
- Rewords the baseline notice from ambiguous “setup signals” language to **health signals** language.
- In the current test state, the baseline notice should read **3 of 5 health signals are ready** and explain that debt and full savings information are still needed.
- Lab Readiness remains a separate 6-area setup measure, so users can understand why `4 of 6 areas complete` and `3 of 5 health signals ready` are different measurements.
- The provisional 68/100 baseline is preserved; this patch only makes unknown information visually honest and the wording clearer.

## Preserved behavior

- $0 available today.
- $700 planned paycheck for Oct 2.
- $170 planned protected.
- $530 planned TRUE Safe-to-Spend.
- Debt remains skipped/unknown, not zero.
- Savings setup remains recommended.
- PAYCHECK LANDS OCT 2 stays locked before payday.
- v4.1.16 reconciliation still waits for the real paycheck.
- Bill Calendar, Forecast Engine, Reserve Memory, Weekly Runway, Pace Coach, Reports, Guided Setup, Lab Readiness, and history remain unchanged.
