# Independent product verification — FAIL

Verified 2026-08-28 for work order `split-pass-through-costs-verify-1`.

- Candidate: `5e0f616b65e1760ff1d8b42e7b7fa85fe5d4f17a`
- Repository/branch: `B-Divyesh/sf-split-pass-through-costs`, `main`
- Public URL: <https://split-pass-through-costs.sociobot.in>
- Artifact: offline/local-first PWA
- Final result: **FAIL**

The ordinary split/export workflow works and the public files match the candidate, but three release-blocking defects remain: invalid money can retain a hidden prior value while the UI still says “Balanced exactly”; a malformed import can permanently break startup for that origin; and the advertised live Pro checkout returns HTTP 404. The accessibility contract also fails on both legal pages.

## Candidate and deployment identity

Verification started from a clean checkout with `HEAD`, `origin/main`, and the requested candidate all at `5e0f616`. After `npm ci`, the exact `npm run build` output was compared with the live origin. SHA-256 hashes matched for `index.html`, `assets/app.js`, `assets/app.css`, `sw.js`, `manifest.webmanifest`, both legal pages, `legal.css`, `offline.html`, the hero WebP, and all three PNG icons. Examples:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `9e1730aee392d9e674a4c69f25a1495290bf35cd893531b560306e1519660090` |
| `assets/app.js` | `f15d129d0efe8cbfa19eb92e192a2a2d6709fdf030df8c82b0a12946242a9f70` |
| `assets/app.css` | `5b5564bf1c555617cc8f3fd14b56cc6afceddbbc3d6feb3f9131c48678ef1b6e` |
| `sw.js` | `541ef93482afc803578e954e50a93be8af12d9d0f539501330853793d3e7dbbd` |
| `manifest.webmanifest` | `b803fd59fc28fc6f73b962f29883e0e914a83ed2030ec21b160a2bb25f1dd5c8` |

This is fresh evidence that the live product is the candidate artifact, not a stale or missing deployment.

## Local gates

Run from the clean candidate checkout:

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages installed from lockfile |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| `npm test` | PASS — 3/3 Vitest and 12/12 Playwright tests |
| Type check | PASS — `tsc --noEmit` is part of the production build |
| Lint | Not available — no lint script/configuration in the repository |
| `npm run build` | PASS — Vite 6.4.3 emitted `dist/` |

Production output was 27,541 B JavaScript (9,207 B gzip), 15,491 B CSS (4,160 B gzip), and 58,066 B for the hero WebP. These pass the 200 KB JS, 50 KB CSS, and 300 KB hero budgets.

## Independent product exercise

Tests ran against the local production preview and the live HTTPS origin in desktop Chromium and at 390×844 mobile. Temporary verifier-only tests were removed after use; product code was not changed.

Passing paths:

- Completed a representative `$0.03` mixed bill with `$0.01` billable and `$0.02` overhead, observing exact under-, over-, and balanced states without floating-point drift.
- Exported and inspected CSV; treatment/category/source fields and exact cents were correct. Formula-leading supplier, reference, and description cells were neutralized.
- Copied a client-ready line list and confirmed only billable rows contributed to the reimbursement total.
- Saved, refreshed, closed/reopened the tab, reopened from the archive, removed/undid a row, cancelled/confirmed deletion, exported a valid JSON backup, and reached the five-slip free cap and Pro prompt.
- Rejected a non-image/PDF attachment and a 10,000,001-byte PDF; a 10,000,000-byte PDF succeeded. A normally named slip retained its attachment after a new tab/reload.
- Invalid backup format produced a useful rejection message. Recovery from under/over allocations worked once valid numbers were entered.
- Desktop and 390 px layouts had no horizontal overflow. Keyboard skip link, start action, row creation, dialog open/Escape close, and visible 3 px focus outline worked. Reduced motion computed to effectively instant transitions and automatic scrolling.
- Fresh ordinary use made zero cross-origin requests. No analytics, remote fonts, remote scripts, or bill upload occurred.
- A returned invalid license was stripped from the page URL, stored under the documented key, verified only against the Sociobot endpoint, and left free tools usable with “License no longer active.” No console/page errors occurred on normal load.

Failing paths are recorded below.

## Defects

### High

1. **Invalid money silently retains a previous valid value and balanced state.** Enter total `10.00` and row amount `10.00`, then replace the row amount with `10.999`. The input gets `aria-invalid=true`, but the model retains `1000` cents, the UI continues to say **Balanced exactly**, and autosave/export use `$10.00`. Reload replaces the user's visible invalid entry with `10.00`. There is no announced error or save/export block. This can produce an incorrect reconciliation in the product's core job.

2. **A malformed but accepted backup can poison IndexedDB and break every later startup.** Importing `{"format":"split-cost-slip","version":1,"slips":[{"id":"poison","totalCents":100,"allocations":[]}]}` passes the import's shallow validation and persists. Reload then raises `Currency code is required with currency style`; initialization stops at “Checking connection…” and saved data is inaccessible. The UI offers no repair path. Clearing all site data recovers the app but also discards legitimate slips and attachments.

3. **The advertised Pro purchase path is unavailable in production.** Fresh GET evidence for `https://api.sociobot.in/api/v1/products/split-pass-through-costs/checkout` was HTTP **404** with `{"error":"enabled factory product","status":404}`. The app advertises “Unlimited slips. $19 once.” and sends buyers directly to this broken endpoint. Invalid-token verification itself works (HTTP 200, `valid:false`) with correct CORS and `no-store`.

### Medium

1. **An attachment added before any slip data silently disappears after reload.** A valid boundary-size 10,000,000-byte PDF is written to IndexedDB and shown as attached, but `saveCurrent()` refuses to persist the otherwise-empty slip. Reload shows “No attachment yet,” leaving an unreachable orphan blob. This violates the promise to retain original attachments locally.

2. **Both legal pages have a serious axe color-contrast failure.** At desktop and 390 px, `.eyebrow` uses `#c63d18` on `#f2efe6` at 11 px bold: measured 4.47:1 versus the required 4.5:1. `/privacy/` and `/terms/` each report one serious `color-contrast` violation. The working screen and Pro dialog had zero serious/critical WCAG 2 A/AA axe findings.

### Low

1. **Production response policy is incomplete.** HTTPS redirect, HSTS, `nosniff`, and `strict-origin-when-cross-origin` are present, but CSP and an anti-framing policy (`frame-ancestors` or `X-Frame-Options`) are absent. The repository's `_headers` file is served as a public file rather than applied by this host.

2. **Production caching misses the supplied performance policy.** HTML, JS, CSS, images, icons, manifest, and service worker all return `Cache-Control: public, must-revalidate, max-age=30`; the intended one-year immutable asset rule and `no-cache` service-worker rule are not active. The JS/CSS filenames are also stable rather than content-hashed.

3. **Some mobile touch targets are below the specified 44×44 CSS px.** The footer Privacy, Terms, and Source links measure approximately 43×15, 35×15, and 41×15 px at 390 px width.

4. **Lighthouse's experimental label-in-name audit fails for the home wordmark.** Visible `S/ Split Cost Slip` is overridden by `aria-label="Split Cost Slip home"`, so all visible label text is not present in the accessible name. Lighthouse still rounds the overall accessibility category to 100 because this audit is unweighted.

## Accessibility, browser, and visual evidence

- Factory URL verifier: HTTP 200; 691 ms network-idle load; title present; `lang=en`; one `h1`; `main` present; no image missing alt; no unlabeled button; zero normal-load console/page errors.
- Axe: working screen and open Pro dialog, 0 serious/critical; privacy page, 1 serious; terms page, 1 serious.
- Keyboard/mobile/reduced motion: core paths passed as described above; screenshots were visually inspected at 1366×900 and 390×844. Hierarchy, stacking, source/allocation/totals/output flow, and focus treatment were usable.
- Chromium installability inspection: manifest parsed with no errors and `Page.getInstallabilityErrors` returned an empty list. Required 192, 512, and maskable 512 icons are present.

## PWA/offline behavior

- Warm offline reload passed locally and live. Saved supplier, exact totals, and balanced state remained available while `navigator.onLine` was false.
- The service worker precaches the shell with versioned cache `split-cost-slip-v4`, claims clients, removes old caches, and provides navigation fallback.
- A controlled production-output update test changed the served worker cache version from v4 to v5. The new worker installed/activated and the open app displayed `A fresh edition is ready. Reload`; result PASS.
- The live manifest start URL is `/?v=1`, display mode is standalone, and Chromium reported no installability errors.

## Performance

Lighthouse 12.5.1 mobile against the live URL:

| Category/metric | Result |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 (root only; see independent legal-page axe failures) |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.0 s |
| LCP | 1.3 s |
| TBT | 130 ms |
| CLS | 0 |
| Speed Index | 1.0 s |
| Interactive | 1.3 s |
| Max potential FID | 160 ms |

No console errors were recorded during the Lighthouse run. The root page meets the stated Lighthouse and bundle budgets.

## Response/privacy evidence

- HTTP redirects to HTTPS with 301.
- Live root/assets: HTTP/2 200; HSTS `max-age=10886400; includeSubDomains; preload`; `Referrer-Policy: strict-origin-when-cross-origin`; `X-Content-Type-Options: nosniff`.
- Normal fresh use: no cross-origin requests.
- Invalid license flow: exactly one expected request to `https://api.sociobot.in/api/v1/products/split-pass-through-costs/verify?...`; API returned `Access-Control-Allow-Origin` for the product origin and `Cache-Control: no-store`.
- User slip/attachment data remained in IndexedDB; JSON backup omitted attachment bytes as disclosed.

## Release decision

**FAIL. Do not approve this candidate for release.** Fix and regression-test all High issues and the legal-page serious axe findings, register/enable the production billing product, redeploy, and rerun independent verification. The live static deployment itself is healthy and matches the requested candidate, so redeploying the same artifact will not change this result.
