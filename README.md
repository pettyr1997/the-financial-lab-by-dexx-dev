# Financial Lab v4.1.16 — Payday Landing + Amount Reconciliation

Builds directly on v4.1.15 Payday Landing Guard. No saved financial-data schema migration is required.

## What changed

- Keeps future payday visibly locked with `PAYCHECK LANDS <DATE>` until the scheduled check date.
- On payday, the lock transitions into a two-step **Payday Check-In** instead of assuming the planned amount arrived.
- Step 1 asks for the **actual deposit received**.
- Step 2 compares actual vs planned and previews the recalculated protected amount and TRUE Safe-to-Spend **before any reserve or savings funding is recorded**.
- Matching checks can activate normally after review.
- Higher/lower checks are recalculated against the existing bills, reserve rules, savings settings, debt settings, and cycle dates.
- If the actual check creates an immediate-bill shortfall, Financial Lab blocks activation and sends the cycle back for review rather than funding an unsafe plan.
- Reconciled amount, variance, and timestamp are stored with the approved paycheck history once activated.

## Product rule added to the roadmap

**Progressive Unlock / Step Guard System:** if a step depends on something that has not happened yet, Financial Lab keeps the next step visibly locked and explains what event unlocks it. This rule should be extended naturally across payday, bills, savings, debt, onboarding, and future Premium workflows.

## Current Sep 29 test state

The approved Oct 2 test cycle should remain locked at `PAYCHECK LANDS OCT 2` with 0 moves funded. The new actual-paycheck reconciliation UI is intentionally unavailable until Oct 2.

## Deployment

Upload these six files together, wait for GitHub Pages to deploy, fully close the installed PWA, then reopen it.
