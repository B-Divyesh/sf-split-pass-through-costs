# Handoff — review 5

Work order: `split-pass-through-costs-review-5`
Review commit: this handoff's commit
Deployment checked: <https://split-pass-through-costs.sociobot.in>

## Delivered

- Added `.factory/review-5.md`; the independent adversarial verdict is **FAIL** with one minor finding, F-5-1.
- F-5-1 records the metaphorical 404 eyebrow/h1 and supplies literal replacement copy.
- Did not modify product code, assets, tests, or deployment configuration.

## Verification

- Fresh clone: `/tmp/split-review5-clean.SKkBWi/repo`; `npm ci` reported zero vulnerabilities.
- All 14 exact `claims.json` commands passed independently in Chromium and Pixel 5.
- `npm test`: PASS — 3 Vitest tests and 46 Playwright tests.
- `npm run build`: PASS — emits `dist/index.html`; main JS is 41.07 kB raw / 12.66 kB gzip and CSS is 19.88 kB raw / 5.03 kB gzip.
- Live checks passed for mobile/desktop cold reads, demo/reset/isolation, same-origin request logging, warm offline reload, route/link crawl, metadata/headers, h1 focus through Back/Forward, 44px targets, and all-level Axe scans.
- Full evidence, copy counts, claims results, history confirmation, and the remaining finding are in `.factory/review-5.md`.

## Run

```sh
npm ci
npm test
npm run build
```

## Known gap

The designed 404 works technically, but `404 / missing sheet` and `This slip is not here.` use a bill metaphor for a missing webpage. Replace them with the literal copy in F-5-1 before a zero-finding PASS.
