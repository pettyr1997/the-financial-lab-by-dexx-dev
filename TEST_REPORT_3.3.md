# Financial Lab Version 3.3 Test Report

## Passed
- JavaScript syntax validation with `node --check app.js`.
- Required paycheck-planner element IDs exist with no duplicate IDs.
- Local HTTP server returned `index.html` and `app.js` successfully.
- Original localStorage key remains `financial-lab-v3-data`.
- Existing legacy fields and bills are migrated without deleting saved data.
- Paycheck allocation covers due bills first, preserves savings when possible, reserves upcoming bills, and calculates a safe-to-spend remainder.
- Service-worker cache name updated to Version 3.3.
- ZIP archive integrity verified after packaging.

## Browser-render limitation
Headless Chromium started but timed out in the container because its system DBus services are unavailable. This was not counted as a successful browser-render test. The app should receive a final visual check after publishing to GitHub Pages.
