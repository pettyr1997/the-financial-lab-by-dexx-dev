# Financial Lab 4.1.5.1 — Paycheck Cleanup Controls

Built on 4.1.5 Memory + PWA Foundation.

## Added
- Delete one approved paycheck without clearing all history.
- Clear only the active check while keeping bills, debts, savings goals, expenses, profile, and approved history.
- Safe rollback of reserve/savings contributions when an approved paycheck is deleted.
- Memory writes continue through the dual on-device persistence layer introduced in 4.1.5.
