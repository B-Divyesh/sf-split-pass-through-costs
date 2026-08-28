# Handoff — review 4

Work order: `split-pass-through-costs-review-4`
Review commit: this handoff's commit
Deployment checked: <https://split-pass-through-costs.sociobot.in>

## Delivered

- Added `.factory/review-4.md`; the independent adversarial verdict is **PASS**.
- Did not modify product code, product assets, or deployment configuration.
- Replaced this handoff with the review-4 evidence and verification instructions.

## Verification

- Fresh clone: `/tmp/split-review4-clean.kP7jbF/repo`; `npm ci` completed successfully with zero reported vulnerabilities.
- Every one of the 14 `claims.json` commands was run independently in that clone and passed in Chromium and Pixel 5.
- `npm test`: PASS — 3 Vitest tests and 46 Playwright tests.
- `npm run build`: PASS — emits `dist/index.html`; main JS is 41.07 kB raw / 12.66 kB gzip and CSS is 19.88 kB raw / 5.03 kB gzip.
- Live checks passed for fresh 390×844 and 1366×900 cold reads, one-click demo/reset/isolation, warm offline behavior, internal/external link crawl, metadata and headers on all routes, designed true 404, deep-link/back/forward h1 focus, consistent chrome, and zero normal-load console errors.
- The full copy audit, claim-by-claim results, historic-finding confirmation, accessibility/route checks, and visual-identity assessment are in `.factory/review-4.md`.

## Run

```sh
npm ci
npm test
npm run build
```

## Known gaps

None found in this review. The optional extraction feature remains BYOK, uses a recorded network-free demo result, and is covered by a fixture-backed test.
