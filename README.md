# Financial Lab v4.1.18 — Lab Readiness Intelligence

Builds directly on v4.1.17 Guided Lab Setup and preserves the locked Oct 2 payday/reconciliation test. No existing financial-data schema is replaced; current bills, approved plans, Reserve Memory, expenses, history, setup skip states, and payday state remain intact.

## What changed

- Adds a compact **Lab Readiness** card to the Laboratory home screen.
- Shows how many of the six setup areas are actually complete and points to the next useful setup action.
- Adds **Plan Accuracy** messaging to the Lab Briefing so TRUE Safe-to-Spend is not presented with false certainty when bills, debt, or savings information is missing.
- Makes the Financial Health Score **provisional** until Money Today, Income/Payday, Bills, Debt Status, and Savings setup are known.
- Historical activity can still contribute to the score, but it can no longer silently convert skipped/unknown information into known information.
- Debt skipped is still unknown. Confirmed debt-free is treated as known and displays correctly in Guided Setup.
- Dexx Action Center now prioritizes missing Bills, Debt Status, and Savings setup before ordinary optimization recommendations.
- Keeps Guided Setup optional after the two essentials: users can still enter the Lab and finish recommended information later.

## Expected current test state

With the existing test data shown during v4.1.17:

- Money available today: $0.00 — ready
- Expected paycheck: $700 on Oct 2 — ready
- Recurring bills: 2 saved — ready
- Debt: skipped / unknown
- Savings: not entered
- Spending history: 2 expenses — ready

The Laboratory should therefore show **4 of 6 areas complete (67%)**, recommend continuing setup with **Debt** next, and label plan accuracy as **Partial**. The Financial Health Score may still display the existing numeric baseline, but it must be labeled **Provisional / Baseline** rather than implying the financial picture is complete.

## Important preserved behavior

- The $700 Oct 2 paycheck remains planned, not available today.
- The $170 protection and $530 TRUE Safe-to-Spend remain scheduled until payday.
- Payday Execution Mode remains blocked before Oct 2.
- v4.1.16 amount reconciliation remains waiting for the real payday.
- Bill Calendar, Forecast Engine, Reserve Memory, Weekly Runway, Pace Coach, Reports, debt/savings managers, and history remain available.
