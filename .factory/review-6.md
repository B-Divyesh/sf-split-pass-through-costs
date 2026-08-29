# Adversarial first-read review 6 — Split Cost Slip

**Verdict: PASS**

Reviewed 2026-08-29 at commit `9fb10234bfe621d6d80dcc178a7e25f4244760f8` against <https://split-pass-through-costs.sociobot.in>. Product code was not changed. `.factory/brief.json` is absent, so scope was checked against the live product, README, design record, demo record, claims registry, every earlier review and polish record, verification records, and handoff.

There are zero blocking, major, minor, unlisted-claim, or untested-claim findings.

## Thirty-second cold read

| Fresh view | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Splits one supplier bill into costs billed to a client and costs kept as overhead. | Contractors who bill materials and need to separate client costs from overhead. | `Try it with sample data`; adjacent copy says a completed supplier bill opens. | PASS |
| 1366×900 | Same. | Same. | Same; the action and all three facts are visible without scrolling. | PASS |

The exact first-screen text is `Split one bill into billable and overhead costs.`, `For contractors who need to separate client costs from their own overhead.`, `Try it with sample data`, and `The sample opens a completed supplier bill.` The sample action is at y=482 on mobile and y=712 on desktop. Both cold loads had no horizontal overflow or console/page error.

## Copy audit

Counts treat hyphenated terms as one word. The landing page, reachable extraction panel, and README contain no sentence over 22 words, banned marketing word, vague or metaphor heading, inconsistent product term, or non-result-naming action. No rewrite is required.

### Landing page and extraction panel

| Words | Exact sentence or sentence-like unit | Check |
| ---: | --- | --- |
| 4 | For contractors billing materials | Audience label |
| 8 | Split one bill into billable and overhead costs. | Job headline |
| 12 | For contractors who need to separate client costs from their own overhead. | Audience sentence |
| 7 | The sample opens a completed supplier bill. | `demo-isolation` |
| 5 | Your real bill starts empty. | First-step fact |
| 4 | Saved in this browser | `slip-persistence` |
| 6 | Works offline after the first visit | `offline-reload` |
| 5 | Saving and exports are free | `free-core` |
| 3 | One supplier bill. | Image caption |
| 4 | Billable costs and overhead. | Image caption |
| 7 | Split one supplier bill in three steps. | How-it-works heading |
| 3 | Enter the bill. | Step heading |
| 7 | Add the supplier total and optional attachment. | `attachment-boundary` |
| 3 | Divide each cost. | Step heading |
| 7 | Mark every cost row billable or overhead. | `split-export` |
| 3 | Export the split. | Step heading |
| 11 | Save a CSV or a client line list when it balances. | `split-export`, `client-output` |
| 4 | No saved slips yet. | Empty state |
| 7 | Your first balanced bill will appear here. | Empty-state instruction |
| 7 | Backup files contain slip details, not attachments. | `backup-omits-attachments` |
| 4 | Required fields are marked *. | Form instruction |
| 4 | Use two decimal places. | Form instruction |
| 9 | Include tax if it is on the supplier bill. | Form instruction |
| 12 | Images and PDFs up to 10 MB are saved in this browser. | `attachment-boundary` |
| 3 | No attachment yet | Empty state |
| 6 | Optional: extraction uses your Sociobot key. | `bill-extraction` |
| 5 | Manual entry still works offline. | `offline-reload` |
| 11 | Billable means you plan to charge the client for that row. | Definition |
| 11 | Enter the bill total and cost rows to check the split. | Empty-state instruction |
| 13 | Each row keeps its supplier bill reference, category, and billable or overhead choice. | `split-export` |
| 8 | Check your bookkeeping and tax treatment before importing. | Guidance |
| 10 | Split Cost Slip does not give tax or accounting advice. | Limitation |
| 3 | It splits bills. | Limitation heading |
| 6 | It does not replace accounting software. | Limitation heading |
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 11 | Keep original attachments and check every export before accounting or invoicing. | Guidance |
| 11 | Split Cost Slip separates one bill into billable costs and overhead. | Footer summary |
| 4 | Extract editable bill details. | Extraction heading |
| 15 | The named attachment goes to the Sociobot gateway only after you choose Extract bill details. | `bill-extraction` |
| 10 | Supplier, reference, date, total, and line items may be returned. | `bill-extraction` |
| 5 | You choose billable or overhead. | `bill-extraction` |
| 10 | The key stays in this browser until you remove it. | `bill-extraction` |
| 6 | Get a key at sociobot.in (external). | External destination |
| 6 | This demo uses a recorded result. | `bill-extraction` |
| 5 | It sends no request. | `local-privacy` |
| 3 | Edit each suggestion. | Extraction instruction |
| 9 | Choose billable or overhead for every line before applying. | `bill-extraction` |
| 3 | Suggestions are ready. | Result state |
| 8 | Check every field and choose each line's treatment. | Result instruction |

Demo-only sentence-like units also pass: `Demo — sample data, nothing is saved` (6), `Sample records use separate browser storage.` (6), `Completed sample` (2), `Supplier bill total` (3), `Balanced exactly` (2), and `Two billable rows · one overhead row` (6).

### README

| Words | Exact sentence | Check |
| ---: | --- | --- |
| 9 | Split one supplier bill into billable costs and overhead. | Job summary |
| 14 | It is for contractors who need to separate client costs from their own overhead. | Audience sentence |
| 9 | Attach the supplier bill and enter each cost row. | Workflow |
| 6 | Mark each row billable or overhead. | `split-export` |
| 7 | Export a CSV or client line list. | `split-export`, `client-output` |
| 15 | CSV keeps each row's supplier bill reference, category, amount, currency, and billable or overhead choice. | `split-export` |
| 12 | Client line lists and printed client line lists include billable rows only. | `client-output` |
| 12 | Images and PDFs up to 10 MB are stored in this browser. | `attachment-boundary` |
| 8 | Saved slips and attachments stay in this browser. | `slip-persistence` |
| 9 | Exact cent totals show balanced, under, and over states. | `cent-balance` |
| 9 | JSON backups export saved slip details without attachment files. | `backup-omits-attachments` |
| 10 | A separate sample demo never reads or writes real slips. | `demo-isolation` |
| 10 | Install Split Cost Slip as an app in supported browsers. | `installable-app` |
| 7 | It works offline after the first visit. | `offline-reload` |
| 5 | Saving and exports are free. | `free-core` |
| 13 | Optional extraction sends the named attachment to Sociobot only after you start it. | `bill-extraction` |
| 10 | It uses your Sociobot key and returns editable bill details. | `bill-extraction` |
| 9 | You choose billable or overhead for every suggested line. | `bill-extraction` |
| 5 | Manual entry remains available offline. | `offline-reload` |
| 11 | Split Cost Slip does not replace accounting software or provide tax advice. | Limitation |
| 5 | Requires Node.js 20 or newer. | Verified setup fact |
| 5 | Vite prints the local URL. | Verified setup fact |
| 8 | Real records use browser storage for that origin. | `manual-data-privacy` |
| 6 | The demo uses separate browser storage. | `demo-isolation` |
| 4 | Playwright 1.58.2 is pinned. | Verified package fact |
| 10 | If Chromium is missing, run npx playwright install chromium once. | Setup instruction |
| 12 | npm test runs money, desktop, mobile, accessibility, privacy, extraction, and offline tests. | Verified test-scope fact |
| 7 | The production build is npm run build. | Verified build instruction |
| 5 | Deploy the generated dist/ directory. | Deployment instruction |
| 7 | Every visitor-facing claim is listed in .factory/claims.json. | Registry check passed |
| 8 | Run each listed command from a fresh checkout. | Verification instruction |
| 5 | Demo details are in .factory/demo.md. | Documentation pointer |
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 10 | Manual bill entry, storage, and exports stay in this browser. | `manual-data-privacy` |
| 14 | Extraction sends the named attachment to api.sociobot.in only after you start it. | `bill-extraction` |
| 8 | Your key remains removable from the extraction panel. | `bill-extraction` |
| 9 | Backup files omit attachments, so keep original attachments separately. | `backup-omits-attachments` |

Headings name their sections: `How it works`, `Enter the supplier bill`, `Divide the bill into cost rows`, `Match the split to the bill total`, `Export the finished split`, `Privacy and limits`, and `Extract editable bill details`. README headings are literal document sections. Product terms remain consistent: `supplier bill`, `attachment`, `cost row`, `billable`, `overhead`, `client line list`, and `slip`.

Controls use result-naming verbs: `Try it with sample data`, `Enter my bill`, `Show saved slips`, `Create a new slip`, `Export backup`, `Import backup`, `Attach supplier bill`, `Open attachment`, `Extract bill details`, `Add cost row`, `Remove cost row n`, `Save slip`, `Export CSV`, `Copy client line list`, `Print client line list`, `Delete slip`, `Reset demo`, `Start for real`, `Remove saved key`, `Keep entering manually`, `Apply my choices`, `Discard suggestions`, and `Undo`. `Demo`, `Privacy`, and `Terms` are destination links, not command buttons.

## Demo and sandbox behaviour

- The root sample action reaches `/?demo=1` in one click.
- The first 390×844 screen shows Sunrise Building Supply, `SBS-48192`, Juniper Kitchen Remodel, `$1,287.50`, `Balanced exactly`, two billable rows, and one overhead row. Evidence: `/tmp/review6-mobile-demo.png`.
- The persistent banner contains `Demo — sample data, nothing is saved`, `Reset demo`, and `Start for real`.
- Reset restores Sunrise after an edit. Start for real removes `split-cost-slip:demo`, opens an empty `?new=1` workspace, and leaves the seeded real test slip in `split-cost-slip` unchanged.
- A full live demo flow exercised recorded extraction, attachment, save, CSV, client copy/print, backup export/import, reset, and offline reload. Its 14 recorded requests were all to the product origin. Offline reload retained Sunrise and reported `Offline — ready to keep working` with no console/page errors.
- Code independently selects `split-cost-slip` or `split-cost-slip:demo`; reset is rejected outside demo mode. No demo action reads or writes the real database.

## Claims and clean-clone verification

Fresh clone: `/tmp/split-review6-clean.6tgn0x/repo`. Each exact command in `.factory/claims.json` was run independently. Every desktop Chromium and Pixel 5/390 px instance passed.

| Claim | Result and observable evidence |
| --- | --- |
| `demo-isolation` | PASS 2/2 — seed, reset, exit, and real/demo database separation |
| `split-export` | PASS 2/2 — parsed header and every field on all three CSV rows |
| `attachment-boundary` | PASS 2/2 — attachment-first draft, image/PDF reload, and exact 10,000,000/10,000,001-byte boundary |
| `local-privacy` | PASS 2/2 — complete demo flow records no request to another website |
| `offline-reload` | PASS 2/2 — warm offline sample reload and edit |
| `free-core` | PASS 2/2 — save, reload, CSV, and client copy without a license or paywall |
| `client-output` | PASS 2/2 — copied and printed output excludes overhead |
| `backup-omits-attachments` | PASS 2/2 — saved details remain and attachment bytes are absent |
| `slip-persistence` | PASS 2/2 — edited slip and attachment survive reload |
| `cent-balance` | PASS 2/2 — exact balanced, one-cent under, and one-cent over states |
| `installable-app` | PASS 2/2 — manifest, icons, worker, cache, and Chromium installability |
| `manual-data-privacy` | PASS 2/2 — real manual data stays in browser storage and request bodies omit it |
| `delete-slip-data` | PASS 2/2 — attachment-first slip and blob are removed together |
| `bill-extraction` | PASS 2/2 — explicit send, fixture response, editable facts, user treatment, undo, and removable local key |

The live landing page, README, Privacy, Terms, offline page, and extraction panel contain no claim-like sentence absent from the registry. Developer setup/build facts were also checked directly. No provider key, Azure endpoint, payment path, analytics, or third-party runtime script is embedded.

Additional clean-clone gates passed: `npm ci` with zero vulnerabilities; 4/4 Vitest tests; 56/56 Playwright tests; and `npm run build`. The build emitted `dist/` with 43.32 kB raw / 13.25 kB gzip JavaScript and 19.88 kB raw / 5.03 kB gzip CSS. The factory URL verifier passed in 798 ms with one h1/main, `lang=en`, complete alt/button labels, and no errors.

The live root, demo HTML, JavaScript, CSS, and service worker match the clean build byte-for-byte. Live response policy includes HSTS, CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, one-year immutable caching for hashed assets, and `no-cache` for `sw.js`.

## Structure, routes, accessibility, and identity

- `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, `/404.html`, and an unknown URL have `lang=en`, one h1, one main, plain route-specific title/description, canonical, OG/Twitter metadata, SVG favicon, and 180×180 touch icon.
- Unknown URLs return the designed HTTP 404 with `Page not found`, `We cannot find this page.`, and both recovery paths. `/404.html` itself returns 200 as a static document.
- Root → Privacy, Back, unknown-route navigation, Back, and Forward each focus the destination h1 and update the polite route announcement.
- All crawled internal links, GitHub source, and Sociobot key links return 200. The sitemap covers root, demo, Privacy, and Terms.
- Playwright Axe reports zero WCAG 2 A/AA violations on all checked routes. The committed mobile test confirms every visible link, button, and labelled file action is at least 44×44 px. No route overflows at 390 px. Focus, dialog return focus, keyboard disclosure controls, and reduced motion pass the full suite.
- The warm paper, carbon rules, safety-orange marks, condensed broadsheet type, original workbench bill image, and continuous sheet layout match `.factory/design.md`. The result is recognizably product-specific, not a generic card-and-gradient SaaS template.

## Earlier-finding confirmation

Every prior finding was checked against live behavior and current source/tests. The polish records were used as an inventory, not accepted as proof.

### Review 1

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-1-1 | Both cold viewports answer job, audience, and first action above the fold. |
| F-1-2, F-1-4, F-1-27 | Seeded demo, distinct databases, reset, exit, and real-data isolation pass live and in the tagged test. |
| F-1-3 | Fourteen registry entries each map to one unique tagged test; all 28 project runs pass. |
| F-1-5, F-1-19, F-1-34 | Invalid money cannot remain balanced, save, or export; the full regression suite passes. |
| F-1-6, F-1-7, F-1-21, F-1-30, F-1-37 | Attachment-first persistence, image/PDF reload, exact boundary, association, and deletion pass. |
| F-1-8, F-1-18, F-1-20 | Complete CSV fields and categories are parsed and asserted on every sample row. |
| F-1-9–F-1-11, F-1-15–F-1-16, F-1-22, F-1-25, F-1-32, F-1-36, F-1-54, F-1-57–F-1-59 | Removed cap, Pro, checkout, license, merchant, and purchase claims/actions remain absent from live copy and source. |
| F-1-12 | Save and export outcomes work without payment UI. |
| F-1-13 | Asset provenance remains in design documentation, not visitor marketing copy. |
| F-1-14, F-1-31 | Narrow demo and manual-data privacy promises pass full request interception locally and same-origin interception live. |
| F-1-17, F-1-28–F-1-29 | README scope matches the passing clean suite/build and emitted `dist/index.html`. |
| F-1-23, F-1-33, F-1-35 | Client output, attachment-free backups, and strict atomic import all pass. |
| F-1-24 | Installability, 390 px layout/targets, and offline reload pass. |
| F-1-26, F-1-38 | Legal routes return 200 and have zero Axe violations. |
| F-1-39–F-1-40 | Live security headers and hashed-only immutable caching match the repository policy. |
| F-1-41–F-1-42 | Mobile targets and the complete wordmark accessible name pass. |
| F-1-43 | Unknown routes return the designed HTTP 404 rather than the app home. |
| F-1-44–F-1-46 | Route metadata, shared chrome, destination focus, and announcements pass on every route. |
| F-1-47 | Landing order contains the first-screen facts, product, three steps, limits, and footer. |
| F-1-48–F-1-53 | Job, supplier-bill, cost-row, balance, and output headings remain literal and plain. |
| F-1-55 | The primary action remains `Try it with sample data`. |
| F-1-56 | `Create a new slip` is result-naming and keyboard-operable. |
| F-1-60–F-1-64 | Terminology, sentence length, and README jargon repairs remain fixed. |

### Review 2

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-2-1, F-2-17 | The first demo screen shows the completed sample and uses consistent sample-only labels. |
| F-2-2–F-2-7 | Attachment, CSV, privacy, free-core, reference, and category claims have outcome-level coverage. |
| F-2-8 | Client copy/print excludes overhead; backup export/import is exercised. |
| F-2-9 | Installability has a registered observable Chromium test. |
| F-2-10 | Broad absence wording remains removed; narrow demo/manual request boundaries are tested. |
| F-2-11–F-2-12 | Backup omission, persistence, and cent states remain listed and tested. |
| F-2-13–F-2-14 | Demo metadata and shared route chrome pass live and in source. |
| F-2-15–F-2-16 | Supplier bill, attachment, and client line list terms remain consistent and plain. |

### Review 3

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-3-1 | `/demo` uses the 180×180 touch icon and complete metadata. |
| F-3-2 | Static and fallback 404 headings receive focus on load, Back, and Forward. |
| F-3-3 | Real manual-data privacy has its own passing claim and live same-origin evidence. |
| F-3-4 | Live JS/CSS are hashed; immutable caching applies only to versioned assets. |
| F-3-5 | CSV/client output copy is limited to balanced splits; backup copy is accurate. |
| F-3-6–F-3-8 | Atomic deletion, removal of the site-data promise, and narrowed Terms claims remain fixed. |
| F-3-9 | Every checked mobile action target is at least 44×44 px. |
| F-3-10 | Saved/sample disclosure names Show/Hide, exposes state, and works by keyboard. |
| F-3-11–F-3-13 | Install, offline, and privacy documentation remains plain and claim-backed. |
| F-3-14 | External GitHub links visibly say `(external)`. |
| F-3-15 | Optional Sociobot extraction is explicit, editable, undoable, BYOK, fixture-tested, and has a manual/offline fallback. |

Review 4 had no findings. Review 5's F-5-1 remains fixed: both static and host-level 404 pages use literal page-not-found wording. The later attachment-first and malformed-comma failures recorded in verification 3 are also fixed in source and covered by passing exact regressions and claims.

## Missed leverage

No obvious implied capability is missing. The product supports manual entry, local attachment retention, CSV, billable-only copy/print, JSON backup/import, install/offline use, and optional factual bill extraction. Extraction goes only through the Sociobot gateway after explicit action, shows the file being sent, uses a removable browser-stored key, leaves treatment to the user, supports undo, and uses a recorded no-network demo result. Sync would conflict with the stated local-data boundary.

## What would make this perfect

Nothing remains to change in this review. Preserve the current first-screen wording, isolated demo, literal 404 copy, and one observable test per claim when future features or copy are added.
