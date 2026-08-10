# Financial Lab 4.0.7 — Debt Manager

Built on the stable 4.0.6 Reserve Memory release.

## Added
- Credit Lab is now a real Debt Manager.
- Save unlimited debt accounts with balance, minimum payment, due date, APR, and account type.
- Choose Balanced, Snowball, or Avalanche payoff strategy.
- Dexx automatically selects the best extra-payment target.
- Payday Mode routes planned extra-debt money to that target after bills, reserves, and savings.
- Record real debt payments from Credit Lab to reduce balances.
- Edit and delete debt accounts.
- Dashboard debt remaining now uses the managed debt total.
- Legacy generic debt fields remain as a fallback if no debt accounts have been added.

## Important
Debt minimum payments are tracked and displayed, but 4.0.7 does not silently add them to Bills Manager. This avoids accidental double-counting. A later debt-intelligence update can explicitly connect minimum payments to the payday calendar.

Upload all files directly over the current DEV repository files.
