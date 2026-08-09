# Financial Lab 4.0.2 — Recurring Bills Manager

Implemented:
- Financial Profile recurring bills manager with add, edit, and delete.
- Saved bill name, amount, next due date, frequency, priority, and autopay.
- Payday Mode automatically expands recurring monthly/weekly/biweekly bills into bill occurrences.
- Paid status is tracked per occurrence so recurring bills return in future cycles.
- Financial Timeline includes immediate and reserved upcoming bills.
- Existing `financial-lab-v3-data` localStorage data is migrated in place.

Validation:
- JavaScript syntax check
- Required element/id checks
- Asset existence checks
- ZIP integrity
- Payday engine scenario: $700 check + $120 bill before payday + 10% savings => $120 pay now, $70 savings, $510 safe to spend
