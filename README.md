# Financial Lab 4.1.0.5 — Build Button Bypass + DEV Cache Reset

Built from the stable 4.1.0.3 navigation base.

## Root cause found
The previous 4.1.0.4 package still contained the old Budget Lab submit handler. The intended fail-safe builder did not make it into the packaged `app.js`.

## Fixed
- **Build My Payday Plan** is now `type="button"` and no longer depends on HTML form submission.
- The button directly calls `buildPaydayPlanDirect()`.
- The old Budget Lab submit listener has been removed.
- Validation messages appear directly beneath the button.
- Plan data is written to localStorage before `render()` runs.
- If rendering fails, the exact render error is shown instead of silently doing nothing.
- Paycheck-cycle expense binding is preserved.
- Navigation remains based on stable 4.1.0.3.

## DEV cache reset
- Existing service workers are automatically unregistered.
- Existing Cache Storage entries are cleared.
- `app.js` and `styles.css` use 4.1.0.5 cache-busting URLs.
- This is intentional for the DEV build so iPhone Safari cannot keep mixing old JavaScript with new HTML.

## Test
Enter:
- Paycheck
- Check date
- Next payday

Then tap **Build My Payday Plan**.

You must now get one of three visible outcomes:
1. Payday plan built successfully.
2. A validation message telling you what is missing.
3. A specific JavaScript/render error message.

The button should no longer fail silently.
