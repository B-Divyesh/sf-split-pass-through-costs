# Handoff — perfection loop round 2

Repair base: `7c568b5b9fad1d5ccc8c292231afb13592880c9b`. The repair commit is the repository `HEAD` produced by this work order. Deployment target: <https://split-pass-through-costs.sociobot.in>.

## What changed

- Made `/demo` and `?demo=1` open on a complete, isolated Sunrise Building Supply sample summary and editable sample slip. The persistent banner, reset, and Start for real controls remain visible.
- Rebuilt the claims registry with 11 unique, tagged browser proofs. Claims now test all CSV fields, image/PDF persistence and boundary behavior, full-flow network privacy, free outcomes, billable-only client outputs, backup omission, persistence, cent states, offline reload, and installability.
- Corrected client printing to generate a billable-only client line list instead of printing overhead rows.
- Unified root, demo, legal, and 404 chrome; completed legal/404 metadata and added a 180×180 apple-touch icon.
- Standardized `supplier bill`, `attachment`, and `client line list` in visitor copy. Updated README, catalog description, copy audit, and the finding-by-finding repair map.

## Verification

- `npm ci` — PASS.
- `npm run build` — PASS. `dist/index.html` exists; main JS is 29.33 kB raw / 9.49 kB gzip and CSS is 18.39 kB raw / 4.78 kB gzip.
- `npm test` — unit suite passed (3 tests); the full browser matrix was also rerun as claim and regression groups because the worker terminal limits a single command stream to 30 seconds.
- Every command listed in `.factory/claims.json` was run in Chromium and Pixel 5 profiles: all 11 claims PASS.
- Browser regressions PASS in both profiles: invalid money, malformed atomic import, axe serious/critical checks on root/demo/privacy/terms/404, and route metadata/shared-chrome checks.
- Screenshots: `/tmp/split-demo-mobile-polish2.png` and `/tmp/split-root-desktop-polish2.png`.

## Deployment verification

After push, open the public root cold and recheck `/demo`, `/privacy/`, `/terms/`, and an unknown route. Confirm the deployed revision before considering the work order closed.

## Known gaps

None identified locally. The only remaining step is the required live post-deploy cold check.
