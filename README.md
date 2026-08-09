# Financial Lab 4.0.3 — Bills Manager Layout Fix

Development release for the Financial Lab DEV preview.

## What changed
- Fixed the Recurring Bills Manager mobile overlap between **Next due date** and **Frequency**.
- Added shrink-safe grid columns so native iPhone date/select controls stay inside their fields.
- Preserved the two-column Bills Manager layout on normal phone widths.
- Added a one-column fallback for very narrow screens (350px and below).
- All 4.0.2 recurring-bill logic, saved data, Payday Mode calculations, edit/delete, priority, and autopay behavior remain unchanged.
- Service-worker cache bumped to 4.0.3 so the CSS fix replaces the old cached layout.

Upload the files in this ZIP directly to the root of the DEV repository.
