# Handoff

## Adversarial first-read review 1 — FAIL

Reviewed 2026-08-28 for work order `split-pass-through-costs-review-1` against commit `cc621feee496c7aa11ffc9e5696ef8cfdc81e25d` and <https://split-pass-through-costs.sociobot.in>.

Product code was not modified. The full review is in [`.factory/review-1.md`](review-1.md).

### Outcome

**FAIL.** The first screen does not name the audience and hides the desktop primary action below the viewport. There is no one-click sample demo; `/demo` is the normal app and reads real IndexedDB data. `.factory/claims.json`, claim-tagged tests, and `.factory/demo.md` are absent.

All nine defects from the prior verification remain reproducible or unchanged: stale values exported after invalid money input, malformed-import startup poisoning, 404 Pro checkout, first-input attachment loss, legal-page contrast, missing CSP/anti-framing policy, wrong deployed cache headers, undersized mobile footer links, and the wordmark label-in-name failure. The live site also lacks a designed 404, complete route metadata, consistent chrome, route-change focus, and required landing sections. Copy and terminology findings are itemized with rewrites in the review.

### Verification performed

```sh
npm ci
npm test
npm run build
```

- `npm test`: PASS — 3/3 unit tests and 12/12 Playwright tests.
- `npm run build`: PASS — `dist/` emitted; app JavaScript 27.54 kB raw / 9.24 kB gzip.
- Factory URL verifier: PASS for limited root checks; HTTP 200, title/lang/main/h1/alt present, no load console errors.
- Live axe: root passes at desktop and 390 px; Privacy and Terms each fail serious color contrast.
- Warm live offline reload: PASS.
- Fresh ordinary-flow request interception: no cross-origin requests.
- Link crawl: root, Privacy, Terms, and Source return 200; Pro checkout returns 404.
- Fresh-context Playwright reproductions covered demo storage sharing, invalid-money CSV export, malformed import/reload, empty-slip attachment/reload, routing focus, metadata, mobile target sizes, and unknown-route behavior.

### Required next step

Resolve every `F-1-*` finding in `.factory/review-1.md`, deploy the new candidate, and repeat the complete review from fresh browser/storage contexts. Do not treat the passing generic test suite as claim verification; the next candidate needs a populated claims registry and one tagged sandbox test per retained claim.
