# Independent verification 4 — PASS

- **Candidate:** `03eb1bb11fa1cd7a5fcb5ea9547f9a96c2554737`
- **URL:** <https://split-pass-through-costs.sociobot.in>
- **Verified:** 2026-08-29
- **Verdict:** **PASS** — no release-blocking defects found.

## Cold first read

Opened the live root in a fresh browser context. It says: “Split one bill into billable and overhead costs.” It names its audience: contractors separating client costs from their own overhead. The first primary action is **Try it with sample data**, with adjacent copy explaining that it opens a completed supplier bill and leaves the real bill empty. The sample action is one click and opens a persistent demo banner: “Demo — sample data, nothing is saved,” with Reset demo and Start for real controls.

This meets the plain-words and demo-sandbox acceptance criteria.

## Required claims gate

`.factory/claims.json` is present and contains 14 claims. From a clean checkout after `npm ci`, each exact listed command was run separately against the production build preview so every test used the shipped demo entry point. All passed on both configured projects (Desktop Chromium and Pixel 5 / 390px): **28/28 claim runs passed**.

| Claim | Result |
| --- | --- |
| demo-isolation | PASS |
| split-export | PASS |
| attachment-boundary | PASS |
| local-privacy | PASS |
| offline-reload | PASS |
| free-core | PASS |
| client-output | PASS |
| backup-omits-attachments | PASS |
| slip-persistence | PASS |
| cent-balance | PASS |
| installable-app | PASS |
| manual-data-privacy | PASS |
| delete-slip-data | PASS |
| bill-extraction | PASS |

The claim tests prove observable results, including 10,000,000-byte attachment acceptance and 10,000,001-byte rejection, isolated demo storage, exact-cent under/over states, CSV contents, billable-only client output, browser-local manual data, offline reload, and fixture-backed explicit extraction.

## Local quality gates

- `npm ci`: PASS — 61 packages installed; audit reported 0 vulnerabilities.
- `npm run build`: PASS — `tsc --noEmit` and Vite build passed; `dist/` produced.
- `npm test`: PASS — 4/4 Vitest tests and 56/56 Playwright tests in 2m 48s.
- No separate lint script or lint configuration is present.
- Production output: JS 43,317 B raw / 13.25 kB gzip; CSS 19,879 B raw / 5.03 kB gzip. Initial JS is within the 200 kB static-PWA budget.

The full browser suite exercises normal save/export/copy flows, invalid and malformed money recovery, empty required-field recovery, attachment-first draft persistence/deletion, backup import rejection, keyboard disclosure operation, 44px mobile targets, route focus, dialog behavior, reduced motion, PWA installation, service-worker caching, and internal routes.

## Independent live checks

- **Identity:** live `index.html`, `demo/index.html`, and `assets/main-CuNRIbxP.js` SHA-256 values match this candidate’s newly built `dist/` byte-for-byte. Main JS SHA-256: `93d430ecbcc477a046015669b45a8f0debb25b0a279107aecc7720da1826b505`.
- **End-to-end:** saved a live fresh bill, exported the expected CSV row, and copied the client-ready billable line list. The flow stayed same-origin.
- **Boundary/recovery:** live demo showed `$0.01` and “Still to allocate” at 863.99, then `$0.01` and “Over-allocated” at 864.01. An empty fresh bill produced “Enter the supplier before saving.” and moved keyboard focus to Supplier.
- **Privacy:** fresh live root, demo, and manual save/export flows emitted only `https://split-pass-through-costs.sociobot.in` requests and no console/page errors. The optional extraction path is explicitly user-initiated and its fixture-backed claim test verifies its Sociobot-gateway boundary.
- **PWA:** Chromium reported no installability errors. The live service worker controls `/demo`; after first load, an offline reload restored the Sunrise sample and “Offline — ready to keep working.” The worker is versioned `split-cost-slip-v10`, uses `skipWaiting` and `clients.claim`, and the app supplies an update-ready Reload toast path.
- **Accessibility:** live Axe WCAG 2 A/AA scan found zero serious/critical findings on `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html`. At 390px there was no horizontal overflow. Keyboard activation opened the sample; the focused control had a visible 3px orange outline. Reduced-motion media preference was active.
- **Response/security/cache:** root has HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and CSP with `frame-ancestors 'none'`. Fingerprinted JS/CSS are one-year immutable; `sw.js` is `no-cache`; root revalidates after 30 seconds. HTTP redirects to HTTPS. Required internal routes returned 200 and an unknown route returned 404.

## Scope notes

This is a static local-first PWA. It has no product-owned server API, sign-in, payment/unlock route, package, or CLI, so rate-limit/concurrency, Entra identity, consumer-install, and backend health checks do not apply. The researched brief file is absent from this checkout, but the supplied researched brief was used as the functional acceptance contract.

## Defects by severity

- **Critical:** none
- **High:** none
- **Medium:** none
- **Low:** none

