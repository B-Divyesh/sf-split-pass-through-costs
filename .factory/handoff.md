# Handoff — polish 5

Work order: `split-pass-through-costs-polish-5`

Product commit deployed: `ebf8a342470697cf80f5557ce6a3107d6c7bbe7c`

Live URL: <https://split-pass-through-costs.sociobot.in>

## Delivered

- Replaced metaphorical 404 wording in both static and SPA fallback routes with the exact literal copy required by F-5-1.
- Added exact 404 copy, recovery-action, focus, Back, and Forward assertions.
- Updated every route's visible build marker to `polish-5`.
- Advanced and aligned the page/service-worker cache to `split-cost-slip-v9`; the install claim rejects stale cache names.
- Updated the catalog line to a 12-word, 88-character, verb-first description.
- Preserved the job-cost broadsheet design and the existing PWA/offline deployment class.
- Recorded every review finding and its current evidence in `.factory/polish-5.md`.

## Exact verification

- Final clean clone: `/tmp/split-polish5-final-clean.r6Uxfz/repo` at `ebf8a342470697cf80f5557ce6a3107d6c7bbe7c`.
- `npm ci`: PASS, zero vulnerabilities.
- All 14 exact `.factory/claims.json` commands: PASS independently in Chromium and Pixel 5.
- `npm test`: PASS — 3 Vitest tests and 46 Playwright tests.
- `npm run build`: PASS — `dist/index.html`; JavaScript 41.04 kB raw / 12.64 kB gzip; CSS 19.88 kB raw / 5.03 kB gzip.
- Axe: zero WCAG 2 A/AA violations on root, demo, Privacy, Terms, Offline, static 404, and a true unknown route.
- Lighthouse local production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.44 s, CLS 0.0005, TBT 0 ms.
- Factory verifier: live HTTP 200, correct title/lang/h1/main/alt/labels, and zero console errors.
- Live unknown route: HTTP 404, title `Page not found — Split Cost Slip`, focused `We cannot find this page.`, exact recovery copy and actions.
- Live demo: seed/reset/real-data isolation PASS; warm offline reload PASS; only `split-cost-slip-v9` exists; zero other-origin requests.
- Live headers: CSP, `X-Frame-Options: DENY`, nosniff, strict referrer policy; hashed JS immutable; worker no-cache.
- Deployment: Azure Static Web Apps production deployment `35126c96-fe11-4d43-a5a4-90e01f3f600c` succeeded; custom domain returned 200.

Evidence is in `.factory/evidence/polish-5/`, including local/live screenshots, verifier reports, the live smoke report, and Lighthouse JSON.

## Run

```sh
npm ci
npm test
npm run build
```

## Known gaps and next steps

None. No review finding, claim gap, or deployment defect remains.
