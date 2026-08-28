# Polish 3 — complete finding disposition

Repaired from candidate `352fc98c021ce1c3cc2d3cf5884412bcca73cf3c` and adversarial report `48e537a5bdff6ed54cedbc938dcbba4a2f460552`.

Evidence key: browser tests are in `tests/app.spec.ts`; current local screenshots are `.factory/evidence/polish-3/root-desktop.png`, `.factory/evidence/polish-3/root-mobile.png`, `.factory/evidence/polish-3/demo-mobile.png`, and `.factory/evidence/polish-3/extraction-mobile.png`. Post-deploy verification is recorded in `.factory/evidence/polish-3/live/`; the live URL for each listed route is `https://split-pass-through-costs.sociobot.in` plus its shown path.

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / F-2-13 / F-1-44 | Corrected `/demo` to use the 180px touch icon, hashed social art, and full Twitter image metadata. | route metadata test; `demo-mobile.png`; live `/demo` metadata check |
| F-3-2 / F-1-46 | Added `route-focus.js` for static 404/offline/legal pages and preserved focused app 404 headings. | route focus/back-forward test; live `/404.html` and unknown-route focus check |
| F-3-3 / F-2-10 / F-1-31 | Added real-workspace network/privacy claim and narrowed legal wording to its observable manual-data boundary. | `@claim:manual-data-privacy`; live `/privacy/` |
| F-3-4 / F-1-40 | Hashed JavaScript, CSS, hero, and social assets; immutable caching now applies only to `/assets/*`; stable icons revalidate. | immutable-cache test; live root headers |
| F-3-5 | Rewrote output timing: CSV and client lines require a balanced split; backup wording identifies saved details. | `@claim:split-export`, `@claim:client-output`, `@claim:backup-omits-attachments`; live `/privacy/` |
| F-3-6 | Added an atomic slip-plus-attachment deletion claim and UI confirmation. | `@claim:delete-slip-data`; live `/privacy/` |
| F-3-7 | Removed the untested site-data-clearing promise. | copy audit; live `/privacy/` |
| F-3-8 | Replaced broad free-use Terms copy with the registered save/export and manual-record promises. | `@claim:free-core`, `@claim:manual-data-privacy`; live `/terms/` |
| F-3-9 | Gave header, wordmark, footer, action, skip, and dialog controls 44px targets; checked all visible mobile targets. | mobile target-size test; `root-mobile.png`, `demo-mobile.png`; live 390px check |
| F-3-10 | Saved-list disclosure now says Show/Hide saved or sample slips and updates with `aria-expanded`. | disclosure keyboard test; live `/demo` |
| F-3-11 | Rewrote the install/offline README copy and added Chromium installability-error coverage. | `@claim:installable-app`; README/live manifest check |
| F-3-12 | Replaced internal `offline-reload` README jargon with “offline tests.” | copy audit; README check |
| F-3-13 | Replaced browser-security jargon with “The demo sends no requests to other websites.” | `@claim:local-privacy`; live `/demo` |
| F-3-14 | Renamed every footer link `Source on GitHub (external)`. | shared chrome/link test; live root and legal routes |
| F-3-15 | Added optional, explicit-action Sociobot bill extraction with a recorded demo result, editable facts, required user treatments, undo, local removable key, and no embedded key. | `@claim:bill-extraction`; `extraction-mobile.png`; live `/?new=1` |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Demo opens at a completed Sunrise supplier bill and visible balanced rows, not a second landing hero. | `@claim:demo-isolation`; `demo-mobile.png`; live `/?demo=1` |
| F-2-2 | Attachment test now persists an image and a 10,000,000-byte PDF and rejects 10,000,001 bytes. | `@claim:attachment-boundary`; live `/demo` |
| F-2-3 | CSV test parses the complete header and all three exact rows. | `@claim:split-export`; live `/demo` download |
| F-2-4 | Demo privacy flow exercises recorded extraction, attachment, save, CSV, copy, print, backup/import, reset, and exit. | `@claim:local-privacy`; live `/?demo=1` |
| F-2-5 | Free-core test saves, reloads, downloads CSV, and reads copied output without payment UI. | `@claim:free-core`; live `/demo` |
| F-2-6 | Output wording and registry use the complete supplier-bill-reference/category/amount/currency/treatment promise. | `@claim:split-export`; live root output section |
| F-2-7 | Category values are asserted for every sample CSV row. | `@claim:split-export`; live `/demo` CSV |
| F-2-8 | Client copy and print are billable-only; backup export/import and malformed import paths are covered. | `@claim:client-output`, `@claim:backup-omits-attachments`, malformed-import regression; live `/demo` |
| F-2-9 | Manifest, icons, versioned start URL, service worker, and Chromium installability errors are checked. | `@claim:installable-app`; live `/manifest.webmanifest` |
| F-2-10 | Broad absence copy is gone; narrow demo and manual privacy claims have behavioral tests. | `@claim:local-privacy`, `@claim:manual-data-privacy`; live `/privacy/` |
| F-2-11 | Backup boundary is registered and proves omitted bytes. | `@claim:backup-omits-attachments`; live archive panel |
| F-2-12 | Persistence and exact balance state each have registry entries and browser tests. | `@claim:slip-persistence`, `@claim:cent-balance`; live `/demo` |
| F-2-13 | Every route, including `/demo`, has route-specific metadata and the 180px touch icon. | route metadata test; live `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html` |
| F-2-14 | Root, demo, static routes, and fallback 404 share wordmark, nav, footer, external label, and build label. | shared chrome test; screenshots; live routes |
| F-2-15 | Standardized supplier bill, attachment, cost row, billable/overhead, and client line list wording. | copy audit; live root/demo/legal check |
| F-2-16 | Removed `clear`, `namespace`, and visitor-facing IndexedDB jargon. | copy audit; live copy check |
| F-2-17 | Demo consistently uses Sample slips, Sample records, Sample record, and the required isolation banner. | `@claim:demo-isolation`; `demo-mobile.png`; live `/demo` |

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Contractor-specific job headline, audience sentence, and both first actions are above the fold. | `root-desktop.png`, `root-mobile.png`; live `/` |
| F-1-2 | One-click `?demo=1` is a seeded, separate database with banner, reset, and real-start discard. | `@claim:demo-isolation`; `demo-mobile.png`; live `/?demo=1` |
| F-1-3 | Added the complete claims registry and one unique tagged browser test per claim. | registry/link test; clean claim run |
| F-1-4 | Demo/real storage is isolated. | `@claim:demo-isolation`; live root/demo switch |
| F-1-5 | Valid splits export exact rows; invalid money blocks balance, save, and output. | `@claim:split-export`; invalid-money regression |
| F-1-6 | Attachments persist from attachment-first and edited-slip paths. | `@claim:attachment-boundary`, `@claim:slip-persistence` |
| F-1-7 | 10 MB attachment limit has exact accepted/rejected boundaries. | `@claim:attachment-boundary` |
| F-1-8 | CSV preserves each named row’s reference, category, amount, currency, and treatment. | `@claim:split-export` |
| F-1-9 | Removed the five-slip cap and its claim. | free-core test; copy audit |
| F-1-10 | Removed unavailable $19 checkout offer. | shared link test; copy audit |
| F-1-11 | Removed unverified Pro/history claim. | copy audit |
| F-1-12 | Narrowed to free saving and exports, then proved outcomes. | `@claim:free-core` |
| F-1-13 | Removed untestable asset-provenance marketing copy; provenance remains in design documentation. | copy audit; `.factory/design.md` |
| F-1-14 | Narrowed and tested demo network privacy. | `@claim:local-privacy` |
| F-1-15 | Removed dead hosted-checkout wording. | link test; copy audit |
| F-1-16 | Removed unsupported merchant/refund wording. | copy audit |
| F-1-17 | Rewrote README for contractors and mapped its product claims. | copy audit; README |
| F-1-18 | Tested attach, split, CSV, client output, backup, and invalid handling. | claim suite; live demo |
| F-1-19 | Invalid decimals never retain a balanced state or export stale cents. | invalid-money regression |
| F-1-20 | CSV category behavior is listed and asserted row by row. | `@claim:split-export` |
| F-1-21 | Image/PDF persistence and size bounds are verified. | `@claim:attachment-boundary` |
| F-1-22 | Removed paid archive and cap promises. | copy audit; free-core |
| F-1-23 | Client copy/print, backup behavior, and strict import are independently tested. | `@claim:client-output`, `@claim:backup-omits-attachments`, malformed-import regression |
| F-1-24 | Installability, 390px target sizing, and offline reload are verified. | `@claim:installable-app`, `@claim:offline-reload`, mobile target test |
| F-1-25 | Removed unavailable paid-license claim. | copy audit |
| F-1-26 | Privacy and Terms are real routes with metadata, shared chrome, focus, and axe coverage. | route/axe test; live `/privacy/`, `/terms/` |
| F-1-27 | Documents and tests distinct real/demo browser storage. | `.factory/demo.md`; `@claim:demo-isolation` |
| F-1-28 | README now names the actual money, browser, accessibility, privacy, extraction, and offline suite. | README; `npm test` |
| F-1-29 | Build remains `npm run build` and emits `dist/index.html`. | build gate |
| F-1-30 | Slip/attachment relationship persists and deletion removes both stores. | `@claim:slip-persistence`, `@claim:delete-slip-data` |
| F-1-31 | Replaced broad absence copy with separately tested demo and manual privacy boundaries. | `@claim:local-privacy`, `@claim:manual-data-privacy` |
| F-1-32 | Removed obsolete license verification claim and path. | source/copy audit |
| F-1-33 | Backup omission is explicit and byte-tested. | `@claim:backup-omits-attachments` |
| F-1-34 | Fixed stale invalid-money model state and blocks outputs. | invalid-money regression |
| F-1-35 | Strict schema validation and atomic import prevent startup poisoning. | malformed-import regression |
| F-1-36 | Removed dead purchase UI and calls. | source/link test |
| F-1-37 | Attachment-only input is saved with its slip. | `@claim:attachment-boundary` |
| F-1-38 | Legal contrast and all route axe checks pass. | axe route test; live legal URLs |
| F-1-39 | Static config carries CSP, anti-framing, nosniff, and referrer headers. | production config/header check; live root |
| F-1-40 | Immutable headers only cover fingerprinted `/assets/*`; worker and icons revalidate safely. | immutable-cache test; live headers |
| F-1-41 | Footer and all visible mobile controls meet 44×44px. | mobile target test; mobile screenshots |
| F-1-42 | Main wordmark accessible name contains its visible `S/ Split Cost Slip` text. | axe/route smoke; live root |
| F-1-43 | Static/SWA 404 is designed, linked, titled, and has a return path. | route metadata and focus tests; live unknown URL |
| F-1-44 | Route-specific title, description, canonical, OG/Twitter art, favicon, and touch icon are complete. | route metadata test; live routes |
| F-1-45 | Shared route skeleton, sitemap, headers, and build label are complete. | shared chrome/link test; live route crawl |
| F-1-46 | Route and static 404 heading focus/announcement work through forward/back navigation. | route focus test; live 404 |
| F-1-47 | Landing has three facts, three steps, limits, and the workspace. | root screenshots; live `/` |
| F-1-48 | Replaced slogan with plain split-job headline. | copy audit; root screenshots |
| F-1-49 | Replaced internal eyebrow with contractor audience text. | copy audit; live `/` |
| F-1-50 | Supplier-bill heading is explicit. | copy audit; live workspace |
| F-1-51 | Cost-row heading is explicit. | copy audit; live workspace |
| F-1-52 | Balance heading names the matching task. | `@claim:cent-balance`; live workspace |
| F-1-53 | Output heading names the exported split. | `@claim:split-export`; live workspace |
| F-1-54 | Removed the paid section. | copy audit |
| F-1-55 | Primary action is Try it with sample data. | root screenshots; live `/` |
| F-1-56 | New-slip action is verb-led and keyboard operable. | browser interaction suite; live workspace |
| F-1-57 | Removed paid-details action. | copy audit |
| F-1-58 | Removed license restore action. | copy audit |
| F-1-59 | Removed Buy Pro action. | free-core/link test |
| F-1-60 | Standardized terminology, including the CSV’s supplier bill reference and client line list. | copy audit; live root/demo/legal |
| F-1-61 | README opener is short and contractor-specific. | copy audit |
| F-1-62 | README workflow uses short concrete sentences. | copy audit |
| F-1-63 | README test wording is plain and short. | copy audit |
| F-1-64 | README product introduction avoids implementation/accounting jargon. | copy audit |

No finding is deferred. The live status column is completed after the deployment check in the final handoff.
