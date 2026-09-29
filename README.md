# Financial Lab v4.1.19 — Dexx Money Journey

Built directly on v4.1.18.1. This release turns the Progressive Unlock idea into a visible step-by-step money journey on the Laboratory home screen. No financial-data schema changes and no payday math changes.

## What changed

- Adds **Dexx Money Journey** directly under the Lab Briefing.
- Shows seven connected stages: Essential Setup → Payday Plan → Paycheck Lands → Reconcile Actual Check → Protect the Money → Live TRUE Safe-to-Spend Runway → Next Paycheck Cycle.
- Each stage is derived from real Financial Lab state rather than a decorative checklist.
- Completed stages show COMPLETE, the active stage is highlighted, and future stages stay visibly locked until their dependency is real.
- Before a future payday, the journey repeats the blocked-payday design language with a disabled **PAYCHECK LANDS [DATE]** button.
- On payday, the landing stage becomes actionable and routes the user to Payday Execution / Reconciliation.
- After the actual deposit is entered, the journey advances to reconciliation before any protection is funded.
- After activation/funding, the journey advances to the live TRUE Safe-to-Spend runway.
- At the next-payday boundary, the journey advances to starting the next paycheck cycle.

## Current Sep 29 / Oct 2 test expectation

- Step 1 Essential setup — COMPLETE.
- Step 2 Payday plan — COMPLETE.
- Step 3 Paycheck lands — locked and labeled OCT 2.
- Steps 4–7 remain locked/upcoming.
- Current-step panel says Paycheck lands.
- Main journey button is disabled and says **PAYCHECK LANDS OCT 2**.
- Existing $700 planned paycheck, $170 planned protected, and $530 planned TRUE Safe-to-Spend remain unchanged.

## Preserved behavior

- Guided Lab Setup and unknown ≠ zero rules.
- Lab Readiness and provisional Health Score logic.
- v4.1.16 actual-paycheck reconciliation.
- Payday Landing Guard and scheduled-vs-funded separation.
- Bill Calendar, Forecast Engine, Reserve Memory, Weekly Runway, Pace Coach, Reports, history, and recovery tools.
