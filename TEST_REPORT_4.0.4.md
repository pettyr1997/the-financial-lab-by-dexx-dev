# Financial Lab 4.0.4 — Dynamic Bills Manager

## Changes
- Removed the visual implication that the recurring-bill estimate is a hard limit.
- Bills Manager now displays the actual number of bills saved.
- Financial Profile expected recurring bills remains a planning estimate.
- Users can continue adding recurring bills beyond the estimate.
- If saved bills exceed the estimate, Dexx automatically raises the profile estimate to match.
- Profile Summary now reports the actual number of bills saved.
- Preserves the 4.0.3.1 iPhone date/frequency layout hotfix.

## Verification
- JavaScript syntax checked.
- No hard-coded `0 of 9 added` Bills Manager progress remains.
- Service worker cache bumped to 4.0.4.
