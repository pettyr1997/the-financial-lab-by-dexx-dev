# Financial Lab 4.0.6 — Reserve Memory

This DEV release makes Dexx remember bill reserves across approved payday plans.

## What changed
- Reserve recommendations are not counted until the user approves the Payday Plan.
- Approval writes each protected amount into persistent Reserve Memory.
- The next paycheck uses the amount already protected and calculates only the remaining funding need.
- PREPARE NOW displays how much is already protected, how much remains, and what this check should add.
- Marking a bill occurrence paid consumes that occurrence's reserve.
- Re-approving the same payday replaces the earlier approval instead of double-counting reserves.
- Editing a bill's due date or deleting the bill clears stale reserve memory for that bill.
- Existing Bills Manager, 4.0.5.1 future-bill pipeline, Financial Profile, saved data, and mobile fixes are preserved.

Upload all files in this ZIP directly over the current files in the DEV repository.
