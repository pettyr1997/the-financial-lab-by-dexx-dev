# Financial Lab 4.1.5 — Memory + Installable App Foundation

## Changes
- Preserved the existing `financial-lab-v3-data` localStorage key so 4.1.4.2 data migrates forward without re-entry.
- Added IndexedDB device-memory mirror for a second synchronized on-device copy.
- Added startup recovery: if the primary localStorage copy is missing, Financial Lab restores from the device mirror when available.
- Added newer-copy recovery using `lastUpdated` timestamps.
- Updated all primary save paths, payday-plan build, and JSON restore to synchronize the mirror.
- Requests durable browser storage when the browser supports `navigator.storage.persist()`.
- Updated Memory Guard copy/status for dual on-device storage.
- Updated backup schema version to 4.1.5 while retaining the existing backup format.
- Replaced the 4.1.4.2 DEV service worker that unregistered itself with a real 4.1.5 cache/service worker.
- Added standalone PWA manifest scope/id/orientation and iOS web-app meta tags.
- Corrected root icon paths in the HTML.
- Updated app asset cache-busters and walkthrough/memory version labels to 4.1.5.

## Static validation
- `node --check app.js`: PASS
- `node --check service-worker.js`: PASS
- Existing localStorage storage key retained: PASS
- Service worker registration present: PASS
- DEV unregister/cache-delete block removed: PASS
- Backup restore writes both storage layers: PASS

## Important limitation
The two storage layers are both local to the device/site. Clearing all Safari website data, uninstalling/removing stored site data, or some OS storage-reclamation scenarios can still remove local data. JSON export remains the off-device recovery path until cloud accounts/sync are added in a later release.
