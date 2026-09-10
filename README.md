# Financial Lab 4.1.5.2 — PWA Update Reliability Fix

Builds on 4.1.5.1 without changing the saved financial-data schema.

## Changes
- Versioned app shell/assets bumped to 4.1.5.2.
- Service worker registration bypasses HTTP cache and explicitly checks for updates.
- New service worker activates immediately and claims open Financial Lab clients.
- Installed-app navigation uses network-first/no-store behavior so GitHub Pages updates are not hidden behind an old cached shell.
- Old Financial Lab caches are removed during activation.
- Controller changes trigger one controlled reload to move the installed app onto the new shell.
- Existing localStorage + IndexedDB financial memory is left intact.

## Test target
Deploy over 4.1.5.1, open the existing Home Screen app, and verify it reaches 4.1.5.2 without reinstalling and still retains the existing $777 test data.
