# Polish 5 — complete cumulative finding disposition

Repaired released candidate `0077b63df5d5336e94c89aeac377a632bf2f0768` from review commit `fd546df3b3392aa287035cb3cb059c13f317c3be`. The deployed product code is commit `ebf8a342470697cf80f5557ce6a3107d6c7bbe7c` at <https://split-pass-through-costs.sociobot.in>.

Final clean clone: `/tmp/split-polish5-final-clean.r6Uxfz/repo`. Every command in `.factory/claims.json` passed independently in Chromium and Pixel 5. `npm test` passed 3 unit tests and 46 browser tests. `npm run build` emitted `dist/index.html`, 12.64 kB gzip JavaScript, and 5.03 kB gzip CSS.

Evidence paths:

- Local screenshots: `.factory/evidence/polish-5/root-desktop.png`, `root-mobile.png`, `demo-mobile.png`, and `404-mobile.png`.
- Cold live verification: `.factory/evidence/polish-5/live/verify.json`, live desktop/mobile screenshots, `.factory/evidence/polish-5/live/404-mobile.png`, and `.factory/evidence/polish-5/live-smoke.json`.
- Lighthouse: `.factory/evidence/polish-5/lighthouse-local.json` — Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.44 s, CLS 0.0005, TBT 0 ms.

## Review 5

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Replaced the page metaphor in both the static and SPA 404 renderers with `Page not found`, `We cannot find this page.`, and `Check the address, return home, or open the sample.` Kept both recovery actions. | `focuses each route heading through unknown-route back and forward navigation`; `404-mobile.png`; live `/round-5-missing` returned 404, focused the h1, and matched every exact string in `live-smoke.json`. |

Review 4 reported no findings. Its complete cold-read, claims, route, accessibility, privacy, offline, and identity pass was repeated in this round.

## Review 3

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Kept the 180×180 touch icon and full route metadata on `/demo` and every document route. | `uses route-specific metadata and one shared chrome`; live `/demo`; `live-smoke.json`. |
| F-3-2 | Kept load, Back, and Forward focus on the destination h1 for static and fallback 404 pages. | `focuses each route heading through unknown-route back and forward navigation`; live focused `/round-5-missing`. |
| F-3-3 | Retained the narrow, separately tested manual-data privacy statement. | `@claim:manual-data-privacy`; live Privacy route; zero outside requests in `live-smoke.json`. |
| F-3-4 | Retained hashed JS/CSS and immutable caching only under `/assets/*`; aligned both runtime and worker caches to v9. | `uses immutable caching only for versioned production assets`; `@claim:installable-app`; live `main-BinSV0vv.js` immutable and `/sw.js` no-cache. |
| F-3-5 | Kept CSV/client output gated on a balanced split and backup wording limited to saved details. | `@claim:split-export`, `@claim:client-output`, `@claim:backup-omits-attachments`. |
| F-3-6 | Kept atomic deletion of a slip and its attachment. | `@claim:delete-slip-data`. |
| F-3-7 | Kept the untested site-data-clearing promise removed. | `.factory/copy-audit.md`; live Privacy copy. |
| F-3-8 | Kept Terms limited to the tested free saving/export and manual-data promises. | `@claim:free-core`, `@claim:manual-data-privacy`; live `/terms/`. |
| F-3-9 | Retained 44×44 targets across app, legal, dialog, offline, and 404 routes. | `keeps every visible mobile link, button, and file action at least 44 by 44 pixels`; live `undersizedTargets: []`. |
| F-3-10 | Retained result-naming Show/Hide labels and `aria-expanded` on the saved-slip disclosure. | `names the saved-slip disclosure action and supports keyboard toggling`. |
| F-3-11 | Retained plain install/offline README wording and Chromium installability proof. | `@claim:installable-app`; README. |
| F-3-12 | Retained `offline tests` instead of the internal `offline-reload` phrase. | `.factory/copy-audit.md`; README. |
| F-3-13 | Retained `The demo sends no requests to other websites.` | `@claim:local-privacy`; zero outside live requests. |
| F-3-14 | Retained `Source on GitHub (external)` on every footer. | `uses route-specific metadata and one shared chrome`; live route crawl. |
| F-3-15 | Retained optional explicit Sociobot extraction, editable facts, user-chosen treatment, undo, removable local key, and recorded demo response. | `@claim:bill-extraction`; `demo-mobile.png`; no embedded key source assertion. |

## Review 2

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the completed Sunrise bill, rows, and balance in the first demo screen. | `@claim:demo-isolation`; `demo-mobile.png`; live `/?demo=1`. |
| F-2-2 | Kept image/PDF reload and exact 10,000,000/10,000,001-byte checks. | `@claim:attachment-boundary`. |
| F-2-3 | Kept parsed header and exact field assertions for all three CSV rows. | `@claim:split-export`. |
| F-2-4 | Kept full demo request interception across extraction, attachment, save, every output, import, reset, and exit. | `@claim:local-privacy`; live zero outside requests. |
| F-2-5 | Kept outcome-level free-core coverage for save, reload, CSV, and copied client output. | `@claim:free-core`. |
| F-2-6 | Kept claim and copy aligned to reference, category, amount, currency, and treatment. | `@claim:split-export`; `.factory/claims.json`. |
| F-2-7 | Kept exact category assertions for every seeded row. | `@claim:split-export`. |
| F-2-8 | Kept client copy/print billable-only and backup/import fully exercised. | `@claim:client-output`, `@claim:backup-omits-attachments`, malformed-import regression. |
| F-2-9 | Kept manifest, icons, versioned start URL, service worker, cache, and Chromium installability checks. | `@claim:installable-app`. |
| F-2-10 | Kept broad absence copy removed and narrow demo/manual privacy outcomes tested. | `@claim:local-privacy`, `@claim:manual-data-privacy`. |
| F-2-11 | Kept attachment-free JSON backup wording and byte-level proof. | `@claim:backup-omits-attachments`. |
| F-2-12 | Kept persistence and exact cent-state claims registered and tested. | `@claim:slip-persistence`, `@claim:cent-balance`. |
| F-2-13 | Kept complete route titles, descriptions, canonical, OG/Twitter art, favicon, and 180px touch icon. | `uses route-specific metadata and one shared chrome`; live route matrix. |
| F-2-14 | Kept the same wordmark, nav, footer links, external label, attribution, and build marker on every route. | Shared-chrome test; live route matrix; build `polish-5`. |
| F-2-15 | Kept `supplier bill`, `attachment`, and `client line list` terminology consistent. | `.factory/copy-audit.md`; live copy review. |
| F-2-16 | Kept implementation jargon out of visitor copy. | `.factory/copy-audit.md`. |
| F-2-17 | Kept sample-only archive/storage labels beside the required demo banner. | `@claim:demo-isolation`; `demo-mobile.png`. |

## Review 1

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the contractor job, audience, sample action, and real action above the fold. | `root-desktop.png`, `root-mobile.png`; live mobile/desktop `actionVisible: true`. |
| F-1-2 | Kept isolated one-click `?demo=1`, seeded data, banner, reset, and discard-on-exit. | `@claim:demo-isolation`; live reset/isolation/offline report. |
| F-1-3 | Kept all 14 claims registered with one unique tagged test each. | `registers every claim once and exposes working internal links`; 14 independent clean-clone commands. |
| F-1-4 | Kept real and demo IndexedDB data isolated. | `@claim:demo-isolation`; live real supplier survived demo reset/exit. |
| F-1-5 | Kept exact valid splitting and invalid-money output blocking. | `@claim:split-export`; `blocks stale invalid money from balance, saving, and export`. |
| F-1-6 | Kept attachment-first persistence. | `@claim:attachment-boundary`, `@claim:slip-persistence`. |
| F-1-7 | Kept exact 10 MB accepted/rejected boundary. | `@claim:attachment-boundary`. |
| F-1-8 | Kept complete row/reference/category/treatment export proof. | `@claim:split-export`. |
| F-1-9 | Kept the five-slip cap and claim removed. | `@claim:free-core`; copy audit. |
| F-1-10 | Kept the unavailable $19 offer removed. | Link crawl; copy audit. |
| F-1-11 | Kept the unverified Pro/history promise removed. | Copy audit. |
| F-1-12 | Kept the narrower free save/export outcome and full result test. | `@claim:free-core`. |
| F-1-13 | Kept provenance in design documentation, not as an untestable visitor claim. | `.factory/design.md`; copy audit. |
| F-1-14 | Kept the narrow demo network promise. | `@claim:local-privacy`; live zero outside requests. |
| F-1-15 | Kept dead checkout wording removed. | Link crawl; copy audit. |
| F-1-16 | Kept unsupported merchant/refund wording removed. | Copy audit. |
| F-1-17 | Kept the contractor-specific README introduction and mapped claims. | README; `.factory/copy-audit.md`. |
| F-1-18 | Kept attach, split, CSV, client output, backup, and invalid handling covered end to end. | Claim suite and invalid-money regression. |
| F-1-19 | Kept invalid decimals from preserving a balanced state or stale export. | Invalid-money regression. |
| F-1-20 | Kept row categories asserted in exported output. | `@claim:split-export`. |
| F-1-21 | Kept image/PDF persistence and exact size bounds. | `@claim:attachment-boundary`. |
| F-1-22 | Kept paid archive and cap promises removed. | Copy audit; `@claim:free-core`. |
| F-1-23 | Kept client copy/print, backup, import, and malformed schema behavior tested. | `@claim:client-output`, `@claim:backup-omits-attachments`, malformed-import regression. |
| F-1-24 | Kept installability, 390px layout/targets, and offline reload tested. | `@claim:installable-app`, `@claim:offline-reload`, mobile target test. |
| F-1-25 | Kept unavailable paid-license claims removed. | Copy audit. |
| F-1-26 | Kept real Privacy and Terms routes with metadata, shared chrome, focus, links, and Axe coverage. | Route metadata/focus/Axe tests; live `/privacy/` and `/terms/`. |
| F-1-27 | Kept separate real/demo storage documented and tested. | `.factory/demo.md`; `@claim:demo-isolation`. |
| F-1-28 | Kept README suite scope aligned to the actual suite. | README; clean-clone `npm test`. |
| F-1-29 | Kept `npm run build` and root `dist/index.html`. | Final clean-clone build. |
| F-1-30 | Kept slip/attachment association across reload and deletion. | `@claim:slip-persistence`, `@claim:delete-slip-data`. |
| F-1-31 | Kept separately tested demo and manual privacy boundaries. | `@claim:local-privacy`, `@claim:manual-data-privacy`. |
| F-1-32 | Kept obsolete license verification code and claim removed. | Source/copy audit. |
| F-1-33 | Kept backup omission explicit and byte-tested. | `@claim:backup-omits-attachments`. |
| F-1-34 | Kept invalid money from exporting stale cents. | Invalid-money regression. |
| F-1-35 | Kept strict, atomic backup schema validation. | `rejects malformed imports atomically and remains usable after reload`. |
| F-1-36 | Kept dead purchase UI and calls absent. | Source search; link crawl. |
| F-1-37 | Kept attachment-only slips associated and reloadable. | `@claim:attachment-boundary`. |
| F-1-38 | Kept legal contrast accessible. | Route Axe test; live zero violations on every route. |
| F-1-39 | Kept CSP, anti-framing, nosniff, and strict referrer headers. | Live response-header check. |
| F-1-40 | Kept immutable caching limited to fingerprinted assets and worker revalidation; aligned runtime/worker cache v9. | Immutable-cache test; live cache headers; `@claim:installable-app`. |
| F-1-41 | Kept footer and all mobile controls at least 44×44 px. | Mobile target test; live `undersizedTargets: []`. |
| F-1-42 | Kept the visible `S/ Split Cost Slip` in the wordmark accessible name. | Route/Axe test; live mobile screenshots. |
| F-1-43 | Kept a designed static and host-level HTTP 404 with both recovery paths; rewrote its remaining metaphor in F-5-1. | Route/focus test; live `/round-5-missing` status 404; `404-mobile.png`. |
| F-1-44 | Kept route-specific titles and complete metadata on every route. | Route metadata test; live route matrix. |
| F-1-45 | Kept shared skeleton, sitemap, static routing config, footer, and build marker. | Shared-chrome/link test; live routes. |
| F-1-46 | Kept focus and polite announcement through direct, Back, and Forward navigation. | Route focus test; live h1 focus on all routes. |
| F-1-47 | Kept facts, three steps, workspace, limits, and footer in the required landing order. | `root-desktop.png`, `root-mobile.png`. |
| F-1-48 | Kept the job-led h1. | Copy audit; live cold read. |
| F-1-49 | Kept the contractor audience label. | Copy audit; live cold read. |
| F-1-50 | Kept `Enter the supplier bill.` | Copy audit; demo screenshot. |
| F-1-51 | Kept `Divide the bill into cost rows.` | Copy audit; demo screenshot. |
| F-1-52 | Kept `Match the split to the bill total.` | `@claim:cent-balance`; demo screenshot. |
| F-1-53 | Kept `Export the finished split.` | `@claim:split-export`; demo screenshot. |
| F-1-54 | Kept the paid section removed. | Copy audit. |
| F-1-55 | Kept `Try it with sample data` as the primary action. | Root screenshots; live cold read. |
| F-1-56 | Kept `Create a new slip` verb-led and keyboard-operable. | Browser interaction and mobile target tests. |
| F-1-57 | Kept paid-details action removed. | Copy audit. |
| F-1-58 | Kept license-restore action removed. | Copy audit. |
| F-1-59 | Kept Buy Pro action removed. | `@claim:free-core`; link crawl. |
| F-1-60 | Kept supplier bill, attachment, cost row, billable, overhead, and client line list terminology. | `.factory/copy-audit.md`. |
| F-1-61 | Kept README opener below 22 words. | `.factory/copy-audit.md`. |
| F-1-62 | Kept README workflow in short concrete sentences. | `.factory/copy-audit.md`. |
| F-1-63 | Kept README test wording short and plain. | `.factory/copy-audit.md`. |
| F-1-64 | Kept implementation/accounting jargon out of the README product introduction. | `.factory/copy-audit.md`. |

## Final live recheck

The post-deploy cold run covered `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, `/404.html`, and `/round-5-missing`. Every route has the correct title, `lang=en`, one h1, one main, focused destination heading, zero WCAG 2 A/AA Axe violations, and no undersized visible target. The unknown route returns HTTP 404. Root and demo return 200. The live request log contained no other origin, and normal routes produced no console error.

The live `?demo=1` run showed the banner, Sunrise sample, and exact balance; reset restored Sunrise; leaving preserved `LIVE POLISH FIVE REAL SUPPLIER`; a warm offline reload restored the sample and reported `Offline — ready to keep working`. The live cache list contained only `split-cost-slip-v9`.

No finding is deferred.
