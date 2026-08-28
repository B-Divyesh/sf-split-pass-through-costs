# Handoff — adversarial review 3

Work order: `split-pass-through-costs-review-3`. Reviewed commit: `352fc98c021ce1c3cc2d3cf5884412bcca73cf3c`. Live target: <https://split-pass-through-costs.sociobot.in>.

## What was done

- Wrote `.factory/review-3.md` with verdict **FAIL**, 15 findings, full copy/claims/history audits, and concrete fixes.
- Did not modify product code.
- Confirmed the live JavaScript, CSS, and demo HTML exactly match the clean local build.

## Verification

- Cold screenshots: `/tmp/review3-root-mobile.png`, `/tmp/review3-root-desktop.png`, `/tmp/review3-demo-mobile.png`.
- Clean clone: `/tmp/split-review3-clean.Tz0jFY/repo`.
- All 11 commands in `.factory/claims.json`: PASS in desktop Chromium and Pixel 5.
- `npm test`: PASS — 3 unit tests and 30 browser runs.
- `npm run build`: PASS — `dist/` emitted; JS 29.33 kB raw / 9.49 kB gzip.
- Live factory URL verifier: PASS; zero console errors.
- Live axe on root, demo, Privacy, Terms, and 404: zero serious/critical findings.
- Live demo reset, real/demo separation, demo exit, no-cross-origin observation, offline reload, route metadata, link crawl, caching, and response headers were checked. The stable CSS cache policy failed.

## Known gaps / next steps

The review is not releasable under the zero-finding rule. Blocking items are the wrong `/demo` apple-touch metadata (reopened F-2-13/F-1-44), missing 404 focus (reopened F-1-46), broad untested Privacy wording (reopened F-2-10/F-1-31), and immutable one-year caching on stable `/assets/app.css` (reopened F-1-40). See `.factory/review-3.md` for all major/minor findings and exact fixes.
