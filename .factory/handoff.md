# Handoff — polish 1

Released repair commit: 89fd592 (product repair 338e70c). Public URL: https://split-pass-through-costs.sociobot.in.

## What changed

- Rewrote the first screen for contractors, with the job headline, sample action, real-entry action, and three tested facts.
- Added a one-click Sunrise Building Supply demo at /demo and ?demo=1. It uses a separate split-cost-slip:demo IndexedDB database, has a persistent banner, reset, and discard-on-exit behavior.
- Added .factory/claims.json, six isolated claim tests, demo/copy documentation, and the full finding map in .factory/polish-1.md.
- Fixed stale invalid-money export, atomic backup schema validation, attachment-first persistence, strict export blocking, legal-page contrast, mobile footer targets, wordmark name, route metadata, common legal chrome, real 404, CSP/anti-framing headers, and asset caching.
- Removed the unavailable Pro checkout and all related price, merchant, and license claims. Core save and export tools are free.

## Verification

Run npm test, npm run build, and each claim command listed in .factory/claims.json.

- npm test: PASS — 3 Vitest tests plus 20 Playwright runs (desktop and Pixel 5).
- npm run build: PASS — dist/index.html and dist/demo/index.html; initial JS 27.55 kB raw / 9.16 kB gzip and CSS 17.13 kB raw / 4.53 kB gzip.
- Fresh clone /tmp/split-cost-slip-clean.FuIAhE: npm ci, build, and all six individual claim commands passed.
- Playwright axe integration: 0 serious/critical WCAG 2 A/AA violations on root, demo, privacy, terms, and in-app 404 at desktop and mobile.
- Offline claim: warm /demo reload passed after context.setOffline(true).

## Deployment and cold live check

Deployed with /opt/fleet/lib/deploy-static.sh split-pass-through-costs dist on 2026-08-28. Azure Static Web Apps deployment completed successfully; custom domain status was Ready.

- Root cold check: title Split Cost Slip — split billable and overhead costs; no console errors; screenshot /tmp/split-cost-slip-live-mobile.png.
- Demo cold check: title Demo — Split Cost Slip, required banner, Sunrise Building Supply sample, and Balanced exactly; screenshot /tmp/split-cost-slip-live-demo.png.
- Live axe via Playwright: root, demo, privacy, and terms all reported 0 serious/critical violations and 0 console errors.
- Live https://split-pass-through-costs.sociobot.in/does-not-exist: HTTP 404, product-styled page, correct title and h1.
- Live response headers: root and legal routes emit CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, and Referrer-Policy; hashed assets are immutable and sw.js is no-cache.

## Known gaps

None. The old paid checkout was intentionally removed because the registered billing endpoint returned 404; it should only return with a registered product and its own sandbox claim tests.
