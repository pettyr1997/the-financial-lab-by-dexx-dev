# Financial Lab 4.1.5.1 — Paycheck Cleanup Controls

## Goal
Add safe cleanup controls after the 4.1.5 persistence/PWA test without wiping unrelated Financial Lab data.

## Added
- Delete an individual approved paycheck from Paycheck Plan History.
- Clear only the active check/work-in-progress plan.
- Deleting an approved paycheck rolls back that plan's reserve and savings-goal contributions.
- If the deleted paycheck is also the active check, its active check fields are cleared.
- Bills, debts, savings goals, expenses, profile data, and other approved paycheck history are preserved.
- All mutations use the existing `save()` path, which synchronizes localStorage and the 4.1.5 IndexedDB device mirror.

## PWA update
- Cache version bumped to `financial-lab-v4.1.5.1`.
- `app.js` and `styles.css` cache-busting query strings bumped to 4.1.5.1.

## Validation
- `node --check app.js` passes.
- Existing 4.1.5 storage key remains unchanged for upgrade compatibility.
