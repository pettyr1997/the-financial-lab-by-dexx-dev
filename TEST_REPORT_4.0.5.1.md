# Financial Lab 4.0.5.1 Test Report

## Scope
Future-bill pipeline hotfix for Dexx Reserve Intelligence.

## Fixes verified
- Dexx scans beyond the short 14-day reserve window across at least four future pay cycles (capped at 90 days).
- Bills after the next payday are included in the reserve calculation even when they fall outside the short profile reserve window.
- Budget Lab now separates **PAY NOW** bills from **PREPARE NOW** future reserves.
- PREPARE NOW shows each bill, full amount, due date, paychecks remaining, and the amount to protect from the current check.
- TRUE Safe-to-Spend is calculated after immediate bills and all current-check future reserves.
- Existing recurring Bills Manager, unlimited bill count, saved browser storage key, and mobile layout are preserved.

## Scenario test
Using a $700 paycheck, next payday Aug 14, and these bills:
- WiFi: $44 due Aug 10
- Phone: $50 due Aug 11
- Ameren: $178.42 due Aug 15
- Rent: $1,240 due Aug 31
- Savings rate: 10%

Expected 4.0.5.1 result:
- Pay Now: $94.00
- Ameren reserve this check: $89.21 (2 paychecks including current)
- Rent reserve this check: $310.00 (4 paychecks including current)
- Total Bills Reserve: $399.21
- Savings: $70.00
- TRUE Safe-to-Spend: $136.79

## Technical checks
- `node --check app.js`: PASS
- New `prepareBills` DOM target: PASS
- Service worker cache bumped to 4.0.5.1: PASS
- Existing storage key `financial-lab-v3-data`: PASS
