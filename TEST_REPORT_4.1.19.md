# Financial Lab v4.1.19 — Test Report

## Goal
Verify the new Dexx Money Journey accurately reflects the real state of the current paycheck cycle and never unlocks future money steps early.

## Pre-payday test — Sep 29, 2026
Expected with the existing approved Oct 2 plan:

- Essential setup: COMPLETE.
- Payday plan: COMPLETE.
- Paycheck lands: locked / OCT 2.
- Reconcile actual check: LOCKED.
- Protect the money: LOCKED.
- Live TRUE Safe-to-Spend runway: LOCKED.
- Next paycheck cycle: upcoming / locked through Oct 9.
- Journey CTA: disabled, **PAYCHECK LANDS OCT 2**.
- No reserve, savings, or spending runway is treated as funded today.

## Payday test — Oct 2, 2026
Expected when the real date arrives:

- Paycheck lands becomes READY NOW.
- CTA becomes **CONFIRM ACTUAL PAYCHECK** and opens Payday Execution / Reconciliation.
- Entering the actual deposit advances the journey to Reconcile Actual Check.
- Protection remains locked until the reconciled plan is activated.

## Post-activation test
Expected after reconciliation and activation:

- Paycheck lands: COMPLETE.
- Reconcile actual check: COMPLETE.
- Protect the money: COMPLETE.
- Live TRUE Safe-to-Spend runway: ACTIVE.
- Next paycheck cycle remains locked until the next-payday boundary.

## Regression checks
- $0 available today remains separate from the future check before payday.
- Existing $700 / $170 / $530 Oct 2 plan remains unchanged.
- Debt unknown state remains `—/20`, not `0/20`.
- Guided Setup, Lab Readiness, Health Score, Bill Calendar, Forecast, Reserve Memory, Pace Coach, Reports, and history remain available.
