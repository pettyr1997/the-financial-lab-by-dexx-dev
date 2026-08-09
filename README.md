# Financial Lab 4.0.5 — Dexx Bills Reserve Intelligence

This development release builds on 4.0.4 Dynamic Bills Manager.

## What changed
- Dexx now separates "money remaining" from TRUE safe-to-spend money.
- Immediate bills are funded first.
- Future bills in the reserve window are split across the paychecks remaining before each due date.
- This paycheck protects its fair share of each upcoming bill instead of reserving every future bill in full.
- Future-bill reserve is funded before savings and extra debt payments.
- Dexx explains which future bills are being protected, how much to reserve now, and why.
- Payday-plan history stores reserve targets and per-bill reserve details.
- Existing Financial Profile, Dynamic Bills Manager, saved data, and mobile fixes remain intact.
