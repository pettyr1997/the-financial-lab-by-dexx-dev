# Financial Lab 4.1.0.4 — Payday Build Recovery

Built on 4.1.0.3 Navigation Recovery.

## Fixed
- Rebuilt the **Build My Payday Plan** submit path as a dedicated fail-safe function.
- The plan state is saved before the screen re-renders, so a display error can no longer silently cancel the build.
- Added visible validation for paycheck amount, check date, and next payday.
- Added visible error messages instead of silent button failure.
- Preserved the existing Lab navigation and Front Door routing.
- Preserved paycheck-cycle expense binding.
- Existing expense cycle IDs now survive reload/migration.

## Cache recovery
- `app.js` and `styles.css` now use versioned URLs.
- Service worker now uses **network-first** delivery for app code/styles.
- Old service-worker caches are removed on activation.
- This prevents GitHub Pages/iPhone from mixing a new `index.html` with an older cached JavaScript file.

## Test order
1. Open Budget Lab.
2. Enter paycheck amount.
3. Enter check date.
4. Enter next payday.
5. Tap **Build My Payday Plan**.
6. Confirm the green/visible status message changes immediately.
7. Confirm plan numbers update.
8. Then test Budget → Credit → Savings → More navigation.

## Preserved
- Expense Manager / Spending Memory
- Cycle binding
- Reserve Memory
- Savings Goals
- Debt Manager
- Bills Manager
- Front Door navigation isolation
- Existing local data
