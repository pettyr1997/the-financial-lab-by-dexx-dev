# Financial Lab 4.1.11 — Test Report

## Static / syntax checks

- [ ] `app.js` passes JavaScript syntax validation.
- [ ] Version markers, cache name, asset query strings, and service-worker registration are 4.1.11.
- [ ] Existing financial-data schema/storage key is unchanged.

## Pace Coach logic reference

Reference cycle: Oct 2 → Oct 9, 7 days, $530 starting TRUE Safe-to-Spend.

- [ ] Sep 29: status Ready; calendar pace 0%; pre-cycle expense excluded.
- [ ] Oct 2: day 1/7; calendar pace ≈14%.
- [ ] Oct 5: day 4/7; calendar pace ≈57%.
- [ ] Oct 8: day 7/7; calendar pace 100%.
- [ ] Oct 9: old runway reports Cycle complete.
- [ ] Spending below calendar pace reports Ahead of pace when the cushion exceeds the tolerance.
- [ ] Spending modestly above pace reports Watch spending.
- [ ] Spending materially above pace reports Spending too fast.
- [ ] Full flexible-budget usage reports Limit reached.

## Live iPhone test

1. Deploy the six update files and fully close/reopen the installed PWA.
2. Confirm the Budget Lab header shows 4.1.11.
3. With the existing future Oct 2 → Oct 9 test cycle, confirm Pace Coach shows Ready and the $530 runway remains unchanged.
4. On/after Oct 2, record cycle-dated test expenses and verify Calendar Pace, Pace Gap, status, and Daily Runway update together.
5. Delete test expenses and confirm the runway recalculates cleanly.
