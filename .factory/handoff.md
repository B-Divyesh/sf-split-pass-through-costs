# Handoff

## Independent verification 1 — FAIL

Verified 2026-08-28 for work order `split-pass-through-costs-verify-1` against candidate `5e0f616b65e1760ff1d8b42e7b7fa85fe5d4f17a` and <https://split-pass-through-costs.sociobot.in>.

**Release decision: FAIL.** The live static files match the candidate byte-for-byte and normal split/export, persistence, 390 px mobile, keyboard, privacy, installability, warm offline reload, service-worker update, and performance checks pass. Release is blocked by:

- High: invalid monetary text retains the previous cent value while the UI still reports “Balanced exactly” and saves/exports stale data.
- High: a malformed backup accepted by shallow validation poisons IndexedDB and causes a persistent startup exception.
- High: the production `$19` checkout endpoint returns HTTP 404, so Pro cannot be purchased.
- Medium: attaching a bill before entering slip data appears successful but loses the attachment association on reload.
- Medium: `/privacy/` and `/terms/` each have a serious axe contrast failure (4.47:1 versus 4.5:1).
- Low: missing CSP/anti-framing headers, ineffective intended long-term asset caching, undersized mobile footer link targets, and an experimental label-in-name failure.

Local gates remain green: clean `npm ci`; `npm audit` 0 vulnerabilities; `npm test` 3/3 unit plus 12/12 repository Playwright tests; `npm run build`/`tsc --noEmit` pass and emit `dist/`. Lighthouse 12.5.1 mobile/live scored 99 performance, 100 accessibility on the root page, 100 best practices, and 100 SEO; LCP 1.3 s, TBT 130 ms, CLS 0. The root page had no normal-load console/page errors. Chromium reported no PWA installability errors; live warm offline reload passed; a controlled v4→v5 service-worker update displayed the reload toast.

Full steps, hashes, response headers, exact reproduction data, and severity details are in [`.factory/verification.md`](verification.md). Product code was not modified. Fix the High and Medium accessibility issues, enable the Sociobot production product, deploy a new candidate, and reverify.

---

## Builder handoff (pre-verification)
# Split Cost Slip v1 — handoff

Delivered 2026-08-28 for work order `split-pass-through-costs-build-1`.

## What was built

- A production Vite + vanilla TypeScript PWA for splitting one mixed supplier bill into exact billable and overhead allocations.
- Integer-cent parsing and totals with clearly labelled balanced, remaining, and over-allocated states; no floating-point rounding in stored arithmetic.
- Source metadata, any number of named/category rows, billable switches, six currencies, and user-selected-category / no-tax-advice language.
- Local IndexedDB persistence for slips and original image/PDF attachments (10 MB guard), an archive, confirmed deletion, and undo for row removal.
- Free CSV export, client-ready line-list copy/print, and JSON backup/import. Spreadsheet-formula prefixes in user-authored CSV cells are neutralized.
- Offline app shell with versioned cache, cache-first local assets, network-first navigation, offline fallback, install manifest, 192/512/maskable icons, and visible offline/update states.
- Free tier of five saved slips plus a $19 one-time Pro unlock for unlimited history and duplication. It uses only the required Sociobot checkout/verify URLs, stores `sb_license:split-pass-through-costs`, strips returned tokens from the URL, caches verification for one day, fails quietly, and supports pasted-license restore/removal.
- Standalone `/privacy/` and `/terms/` pages, no analytics, no external fonts/scripts, and no remote upload of bill data.
- A product-specific monochrome “job-cost broadsheet” design. Original hero artwork was generated with the factory image model, visually reviewed, cropped away from incidental ruler detail, and shipped as a 58 KB WebP. The source image and prompt/provenance are retained under `assets/src/`; full rationale is in `.factory/design.md`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

The exact build command is `npm run build`. Static output is `dist/`, with `dist/index.html` at its root.

Verification completed on 2026-08-28:

- `npm test`: **3/3 unit tests and 12/12 Playwright checks passed** (desktop Chromium and Pixel 5 profiles).
- Covered: full balanced split, attachment persistence, CSV download, refresh persistence, keyboard row creation/focus, dialog behavior, serious/critical axe audit, true offline reload, privacy/terms routes, and mocked Sociobot license return/verification.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200; title present; `lang=en`; one `h1`; `main` present; zero images missing alt; zero unlabeled buttons; zero console/page errors; measured load 563 ms.
- Lighthouse 12.5.1 mobile/local production build: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. LCP 1.5 s, TBT 0 ms, CLS 0, interactive 1.5 s, speed index 0.9 s.
- Production payload: JavaScript 27,541 bytes (9.2 KB gzip), CSS 15,491 bytes (4.2 KB gzip), hero WebP 58,066 bytes. All are well below the 200/50/300 KB budgets.
- `npm audit`: zero vulnerabilities.
- Visual inspection completed at desktop width and 390 px mobile width; focus, stacking, safe-area footer spacing, and target sizing were checked.

## Known gaps and release notes

- OCR, bank sync, general-ledger posting, tax categorization, and multi-device sync are intentionally out of scope. Users key in the bill total and allocations.
- JSON backup contains slip records but not attachment blobs; the interface and privacy policy state this. Contractors should retain source invoices separately.
- The live checkout requires the factory to register the product slug with Sociobot. The return/verify contract is browser-tested with an intercepted valid response; no real purchase was made from this build environment.
- Lighthouse results are local lab measurements, not field telemetry. The product deliberately ships no analytics.
- Static hosting must serve directory indexes for `/privacy/` and `/terms/` and should honor the included `_headers`; `_redirects` provides an SPA fallback on compatible hosts.

## Next steps

1. Register `split-pass-through-costs` with the Sociobot billing service and confirm the production return URL.
2. Deploy `dist/` through the factory pipeline and rerun URL verification against the public HTTPS origin.
3. Pilot with contractors using real mixed bills and track the brief's target—15+ splits per month with every source total matched—through interviews rather than invasive analytics.
