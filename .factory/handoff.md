# Handoff — polish 3

Work order: `split-pass-through-costs-polish-3`
Repair commit: `2b6b592dd7c6f3c3d081745749bdc9ae72a22579`
Branch: `main` (pushed to `origin`)
Deployment: <https://split-pass-through-costs.sociobot.in>
Static deployment id: `cbd5e8b9-8356-44fc-96c3-67e2f91198d8`

## Delivered

- Repaired every blocking, major, and minor item from reviews 1–3. The complete ID-by-ID disposition is in [polish-3.md](polish-3.md).
- Kept the monochrome contractor-broadsheet identity while making the first screen explicit for contractors and giving it a one-click `?demo=1` sample route.
- Made demo storage isolated (`split-cost-slip:demo`), seeded it with the Sunrise Building Supply split, and added the required banner, reset, and real-start discard path.
- Added the complete claim registry and observable tagged browser tests, including real-mode privacy/deletion and fixture-backed optional Sociobot bill extraction.
- Completed metadata, shared route chrome, 404/focus behavior, legal copy, mobile target sizing, immutable hashed assets, PWA cache versioning, plain-language copy, and external-link labeling.
- Updated the verb-first catalog description and copy audit. Generated-art provenance remains recorded in `.factory/design.md`.

## Verification

- `npm test`: PASS — 3 Vitest money tests and 46 Playwright desktop/mobile runs.
- `npm run build`: PASS — `dist/index.html` present. Main JS: 41.07 kB raw / 12.66 kB gzip. Main CSS: 19.88 kB raw / 5.03 kB gzip. The hero is 60 kB WebP.
- Fresh remote clone: `/tmp/split-polish3-clean.SMmpNY/repo`; `npm ci` completed without vulnerabilities. Each of the 14 commands listed in `.factory/claims.json` ran independently and passed in Chromium and Pixel 5. A fresh-clone `npm run test:claims` also passed all 46 runs in 1.1 minutes.
- Browser accessibility: Playwright Axe found zero serious/critical WCAG 2 A/AA issues on root, demo, Privacy, Terms, static 404, fallback 404, offline page, and the extraction dialog. The standalone Axe CLI could not launch because this worker has no system Chrome; the Playwright Axe integration uses the provisioned Chromium.
- Local URL verifier: PASS — 692 ms load, no console errors, `lang=en`, one h1, one main, zero images without alt, and zero unlabeled buttons. Evidence: `/tmp/split-polish3-local-verify.SS4Rwm/verify.json`.
- Local Lighthouse 12.8.2: performance 100, accessibility 100, FCP 1.0 s, LCP 1.7 s, TBT 0 ms, CLS 0.
- Live URL verifier: PASS — 928 ms cold load, no console errors, valid title/lang/main/h1/alt/button checks. Evidence: `/tmp/split-polish3-live-verify.PI6WeP/verify.json`.
- Live targeted review: root and demo metadata use the 180px touch icon; `?demo=1` showed Sunrise, balanced status, banner/reset/start-real, and recorded extraction with no cross-origin request; the unknown route returned HTTP 404 with its h1 focused; Privacy has no `at any time` or clearing-site-data promise; all tested 390px targets were at least 44×44px with no overflow.
- Live headers: fingerprinted `/assets/main-BMINt-i9.js` is `public, max-age=31536000, immutable`; normal routes have CSP, frame denial, nosniff, and strict-origin referrer policy.
- Live Axe: zero serious/critical findings on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`.
- Live Lighthouse 12.8.2: performance 100, accessibility 100, FCP 0.9 s, LCP 1.3 s, TBT 0 ms, CLS 0.

## Evidence files

- Product screenshots: `.factory/evidence/polish-3/root-desktop.png`, `.factory/evidence/polish-3/root-mobile.png`, `.factory/evidence/polish-3/demo-mobile.png`, and `.factory/evidence/polish-3/extraction-mobile.png`.
- Existing local verifier evidence is in `.factory/evidence/polish-3/local-verify/`.
- The deployed root verifier screenshots and report are in `/tmp/split-polish3-live-verify.PI6WeP/` for this work order.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the resulting `dist/` directory as the static app. The factory deployment completed successfully in this work order.

## Known gaps

None. The optional live Sociobot path is BYOK and was fixture-tested without any key or bill leaving the verifier; demo extraction is deliberately recorded and network-free.
