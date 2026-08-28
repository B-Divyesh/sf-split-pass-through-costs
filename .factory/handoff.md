# Handoff — adversarial review 2

Reviewed commit: `7c568b5b9fad1d5ccc8c292231afb13592880c9b`. Public URL: <https://split-pass-through-costs.sociobot.in>. Product code was not changed.

## What was done

- Wrote `.factory/review-2.md` with a fresh 390 px and desktop cold read, complete landing/README copy audit, demo/storage/offline checks, claim execution and coverage review, structure/link/accessibility checks, and verification of all 64 review-1 findings.
- Confirmed the cold first screen, isolated sample/reset/start-real behavior, offline reload, prior data-integrity repairs, response policy, touch targets, and distinct visual identity.
- Recorded a FAIL for the off-screen first demo state, under-scoped and unlisted claims, client printing that includes overhead, incomplete legal/404 metadata, inconsistent route chrome, and inconsistent terminology.

## Verification

From clean clone `/tmp/split-review2-clean.Hpejc8`:

- All six commands in `.factory/claims.json`: command PASS on desktop and mobile. Four have coverage findings documented in review 2.
- `npm test`: PASS — 3 Vitest tests and 20 Playwright runs.
- `npm run build`: PASS — `dist/` emitted; JavaScript 27.55 kB raw / 9.16 kB gzip.
- Live axe: zero serious/critical WCAG 2 A/AA violations on root, demo, Privacy, Terms, and 404.
- Live link crawl: all intended internal routes and GitHub Source returned 200; unknown route returned the designed 404.
- Live demo: separate real/demo IndexedDB databases, reset passed, start-real removed demo storage, no cross-origin request observed, and warm offline reload passed.

## Known gaps and next steps

Verdict is **FAIL**. See `.factory/review-2.md` for every finding and exact fix. The next repair must make the seeded workspace visible immediately, correct client printing, complete claim coverage, finish route metadata/shared chrome, standardize terms, deploy, and rerun the whole review.
