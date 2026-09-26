# Financial Lab 4.1.7.3.1 — Recovery Polish

Builds on 4.1.7.3 without changing the existing financial-data schema.

## Polished
- Undo and Restore now replace stale Payday Mode status copy with a clear recovery-complete message when payday/recovery state is restored.
- New and edited expenses now create descriptive recovery labels such as `Add expense: Recovery test` instead of the generic `Financial Lab update`.
- New and edited recurring bills, savings goals, and debt accounts also create descriptive recovery labels.
- Existing Safety & Recovery snapshots, selective reset controls, Recent Activity, Reserve Memory, Forecast Engine, Bill Calendar, and Payday Guard remain intact.

## Why this patch exists
Hands-on 4.1.7.3 testing proved Undo, Restore, and Selective Reset work. The test also exposed two UX issues: stale payday success text after a recovery and vague recovery-point labels for ordinary saved changes. 4.1.7.3.1 polishes those messages without changing the financial model.
