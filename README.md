# Financial Lab 4.1.0.6 — Direct Payday Control

Built from the stable 4.1.0.3 navigation/cycle-binding base.

## What this fixes
The Build My Payday Plan control was visible but producing no status message at all. That means the tap was not reaching the payday builder.

4.1.0.6 fixes the control itself:

- Build button is a real `type="button"` control.
- Build button sits above neighboring elements with an explicit z-index.
- Pointer/touch events are explicitly enabled.
- An inline click fallback lives directly in `index.html`.
- The inline fallback calls `window.FinancialLabBuildPaydayPlan()`.
- The first tap immediately changes the status to `Button tapped…`.
- If app.js failed to load, the page says **APP CODE DID NOT LOAD**.
- If validation fails, the exact missing field is shown.
- If calculation/rendering fails, the exact error is shown.
- Plan data is saved before rendering.
- Service workers and caches are disabled/cleared in DEV.

## Important
This release intentionally does NOT add new finance features. It is a diagnostic/recovery build focused only on making the Payday Plan control deterministic.

## Test
After deployment, look directly under Build My Payday Plan.

Before tapping it should say:
`Ready to build.`

The instant you tap it, that line MUST change.

That lets us distinguish:
1. Tap/control failure
2. app.js load failure
3. validation failure
4. render/calculation failure
5. successful build

## Preserved
- Stable Lab navigation
- Front Door
- Expense Manager
- Spending Memory
- Paycheck-cycle binding
- Reserve Memory
- Savings Goals
- Debt Manager
- Bills Manager
- Existing local data
