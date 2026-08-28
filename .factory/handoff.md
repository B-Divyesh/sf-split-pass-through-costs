# Handoff — perfection loop round 2

Repair base: `7c568b5b9fad1d5ccc8c292231afb13592880c9b`. Product repair commit: `e3b64d702138c6087968fc604b4bd87a9bd05eb2`. Deployment target: <https://split-pass-through-costs.sociobot.in>.

## What changed

- Made `/demo` and `?demo=1` open on a complete, isolated Sunrise Building Supply sample summary and editable sample slip. The persistent banner, reset, and Start for real controls remain visible.
- Rebuilt the claims registry with 11 unique, tagged browser proofs. Claims now test all CSV fields, image/PDF persistence and boundary behavior, full-flow network privacy, free outcomes, billable-only client outputs, backup omission, persistence, cent states, offline reload, and installability.
- Corrected client printing to generate a billable-only client line list instead of printing overhead rows.
- Unified root, demo, legal, and 404 chrome; completed legal/404 metadata and added a 180×180 apple-touch icon.
- Standardized `supplier bill`, `attachment`, and `client line list` in visitor copy. Updated README, catalog description, copy audit, and the finding-by-finding repair map.

## Verification

- Fresh-clone path `/tmp/split-cost-slip-clean.9mTysx`: `npm ci` — PASS.
- `npm run build` — PASS. `dist/index.html` exists; main JS is 29.33 kB raw / 9.49 kB gzip and CSS is 18.39 kB raw / 4.78 kB gzip.
- `npm test` — unit suite passed (3 tests); the full browser matrix was also rerun as claim and regression groups because the worker terminal limits a single command stream to 30 seconds.
- Every command listed in `.factory/claims.json` was run from that fresh clone in Chromium and Pixel 5 profiles: all 11 claims PASS.
- Browser regressions PASS in both profiles: invalid money, malformed atomic import, axe serious/critical checks on root/demo/privacy/terms/404, and route metadata/shared-chrome checks.
- Screenshots: `/tmp/split-demo-mobile-polish2.png` and `/tmp/split-root-desktop-polish2.png`.

## Deployment verification

- Pushed `e3b64d702138c6087968fc604b4bd87a9bd05eb2` to `origin/main`.
- Local cold check with `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo /tmp/split-local-verify` — PASS: title, `lang`, one h1, main, image alt, labelled buttons, and zero console errors.
- At 12:36 UTC the public host still served prior bundle `main-DjVV47uF.js` (last-modified 11:40 UTC), not this build's `main-ZnuxMIVP.js`. The static work-order configuration has no deploy command beyond the pushed `main` branch, so propagation must complete before the requested public cold check can be recorded.

## Known gaps

No local product gaps. The external static deployment had not propagated by the final worker check; re-run the live cold check once it serves `main-ZnuxMIVP.js`.
