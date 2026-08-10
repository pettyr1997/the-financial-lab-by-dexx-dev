# Financial Lab 4.0.9.1 — Front Door Mobile Polish + Navigation Isolation

Built on the rebuilt 4.0.9 Front Door release.

## Fixed
- Front Door is now fully isolated from the private app.
- Bottom navigation and app chrome are hidden while the Front Door is active.
- Hidden app controls cannot receive taps while the Front Door is open.
- ENTER THE LAB fully closes the landing screen and opens Laboratory.
- JOIN THE LAB fully closes the landing screen and opens Start Here.
- Inside-app navigation no longer jumps back to the Front Door.
- The only explicit route back to the landing screen is More → Front Door.
- Front Door scroll position resets to the top only when intentionally reopened.

## Mobile polish
- Larger full-width Enter / Join buttons.
- Button descriptions stack below their titles.
- Smaller, better-proportioned logo.
- Cleaner Dexx card and quote.
- Plan / Protect / Grow / Spend displayed as separate mobile cards.
- Improved spacing and readability throughout the landing page.

## Preserved
- 4.0.8.2 walkthrough mobile fixes.
- Savings Goals.
- Debt Manager.
- Reserve Memory.
- Bills Manager.
- Payday Mode.
- Existing local browser data.

## Authentication note
This remains a front-end preview. Real cloud login, password recovery, secure accounts, and cross-device sync still require a backend/authentication service.
