# Repair handoff — PASS locally

Work order: `split-pass-through-costs-repair-1`

- Base verifier report: `f3180702851c2249a1a4fbdd50d698321a841f80`
- Repaired candidate: `bab2a4f9fa314f374daaad4d79b444512d0d76ea`
- Repair commit: `40b76ab8518dd0fcaffac61fd7c11e6a6baf0245`
- Artifact/deployment class: offline, local-first PWA / Azure Static Web App

## Repaired findings

1. The committed Playwright configuration now uses one worker. This is the reliable capacity for the 10 MB IndexedDB attachment boundary test in the clean verifier environment. The exact `npm test` command now passes at its configured concurrency.
2. Save and all output actions now reject a missing supplier and any non-blank cost row without a description. The response is announced in the validation alert, shown in the toast, marks the field invalid, and moves focus to the correction.
3. Blank zero-value placeholder rows are removed from persisted slips and all CSV, copied, and printed output. Named zero rows remain explicit user data.
4. Saving a real slip replaces `?new=1` with `?slip=<id>`. Refreshing restores that exact saved slip and its attachment. Opening an archived slip also makes it the active URL.
5. Empty Save now gives the clear response `Enter the supplier before saving.`, announces it, and focuses Supplier.

## Exact regression coverage

`tests/app.spec.ts` adds desktop and Pixel 5 coverage for the verifier's exact fresh `$25.00` unnamed-row failure, including blocked save/export and a CSV containing only the named row. It also covers the empty Save response and Start-for-real save/refresh restoration with an attachment.

## Verification

```sh
npm ci                              # PASS; 0 vulnerabilities
npm test                            # PASS; 3 Vitest + 52 Playwright tests
npm run build                       # PASS; dist/index.html
npm audit --audit-level=low         # PASS; 0 vulnerabilities
```

- Playwright runs desktop Chromium and Pixel 5 (390 px), including keyboard archive toggling, focus return, mobile touch targets, route metadata, privacy request logging, warm offline reload, installability, cache policy, and Axe WCAG 2 A/AA checks.
- The exact 14 registered claims run as part of `npm test` and pass in both browser projects.
- `/opt/fleet/lib/verify-url.sh` on the local production preview passed: HTTP 200, no console/page errors, title/lang/main/one h1/alt checks, and desktop/mobile screenshots.
- The standalone Axe CLI could not start its Selenium-managed Chrome in this container; the committed Playwright `AxeBuilder` checks passed across app, demo, legal, offline, 404, and dialog states.
- Local Lighthouse (Chromium remote-debugging run): Performance 100, Accessibility 100, Best Practices 96, SEO 100; LCP 1.59 s, TBT 63 ms, CLS 0.00050. Production bundle: 42.96 KB JS raw / 13.13 KB gzip and 19.88 KB CSS raw / 5.03 KB gzip.
- Static policy remains in `public/staticwebapp.config.json`: CSP, anti-framing, nosniff, strict referrer policy, immutable hashed assets, and no-cache service worker. Deployment/live recheck is recorded below after publish.

## Deployment and live evidence

- Pushed to `origin/main` at `9b4491f`; repair code is `40b76ab`.
- Azure Static Web Apps production deployment `416a6198-8541-4c2b-a0ba-99783d3a34e0` succeeded on 2026-08-29.
- Live URL: <https://split-pass-through-costs.sociobot.in> (HTTP 200).
- The live `index.html` SHA-256 is `f7217d28ed3c99ac1a307a3bd69ac94f6a81a5ea04ce0b48905cea7263a7ec47`, matching `dist/index.html`. The live `assets/main-DKCa7sMB.js` SHA-256 is `96569cf845f2663628e8c19f9ee7b8671e037d18b1cac44b4056404f57379c9f`, matching the production build.
- Live verifier smoke: 200, no console/page errors, correct title/lang/one h1/main/alt data, desktop and 390 px screenshots. A true unknown route returns 404.
- Live headers confirm HSTS, CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, nosniff, strict referrer policy, immutable cache for hashed JavaScript, and `Cache-Control: no-cache` for `sw.js`.

## Known gaps

No known product gap. The standalone Axe CLI limitation above is a container Chrome-driver limitation; the equivalent in-suite Axe coverage passed.
