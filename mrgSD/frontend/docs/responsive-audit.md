# Storefront responsive audit

Checked on 13 November 2026 with headless Chrome and synthetic product/customer API responses.

## Results

| Check | Coverage | Result |
| --- | --- | --- |
| Page layouts | 18 routes × 6 viewport widths = 108 checks | Passed |
| Expanded interactive states | 18 checks at 320, 768 and 1440px | Passed |
| Navigation without reloading | 18 routes at 375 and 1024px = 36 checks | Passed |
| Frontend unit tests | 9 stock/payment cleanup tests | Passed |
| Production build | `npm.cmd run build` | Passed |

Layout widths: **320, 375, 430, 768, 1024 and 1440px**, with an 844px viewport height. Checks cover unintended horizontal overflow, clipped headings/controls, page scrolling and JavaScript errors. Intentional carousels, scrolling tab lists and ellipsis labels are allowed.

Routes: `/`, `/products`, `/silver`, `/silver/women`, `/gold`, `/gold/men`, `/diamonds`, `/diamonds/women`, `/product/1`, `/about`, `/contact`, `/faq`, `/careers`, `/care-guide`, `/cart`, `/wishlist`, `/checkout`, `/account`.

Interactive checks cover the mobile menu, filters, scrolling after filter dismissal, populated search results, profile editing, adding an address, and a separate checkout billing address.

## Changes

- Silver: allow the filter/sort toolbar to wrap on small screens.
- Shared product galleries: allow flex children to shrink; stack product information and price rows so recommendation cart buttons stay inside their cards.
- Careers: fit benefit cards to narrow screens, reduce small-screen heading/card spacing and wrap the full careers email link.
- Footer: let the email input shrink while keeping the subscribe button visible.
- Search: let the search input shrink so its close button stays accessible.
- Account: constrain grid tracks and wrap profile/address forms within the screen.
- Checkout: keep the form and summary stacked below 992px; place the tablet payment button after the summary.

## Reproducing the audit

From `mrgSD/frontend`, start the Vite development server at `http://127.0.0.1:5173`. Install `playwright-core` in a temporary directory, keeping application dependencies unchanged:

```powershell
npm.cmd install --prefix "$env:TEMP\mrg-responsive-tools" playwright-core --no-package-lock --no-audit --no-fund
node scripts/responsive-audit.cjs
```

The script uses the installed Chrome executable on Windows. Set `MRG_CHROME_PATH` for a different executable or `MRG_PLAYWRIGHT_PATH` for another playwright-core installation. `MRG_AUDIT_URL` overrides the development server URL.

For interactive states:

```powershell
$env:MRG_AUDIT_INTERACTIONS = 'only'
$env:MRG_AUDIT_WIDTHS = '320,768,1440'
node scripts/responsive-audit.cjs
Remove-Item Env:\MRG_AUDIT_INTERACTIONS
```

For navigation between pages without reloading:

```powershell
$env:MRG_AUDIT_SPA = '1'
$env:MRG_AUDIT_WIDTHS = '375,1024'
node scripts/responsive-audit.cjs
```

JSON results and screenshots are saved to `$env:TEMP\mrg-responsive-audit`. The script exits with an error when checks fail.

## Limits

This audit covers storefront routes, not admin pages. It uses mocked API responses to cover populated products, cart, wishlist and account screens without changing real data. It does not validate live backend behavior, payment processing, real device keyboards or Safari/Firefox rendering. Screens outside the sampled widths and closed UI states were not exhaustively tested.
