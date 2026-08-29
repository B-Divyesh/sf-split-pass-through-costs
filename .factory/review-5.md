# Adversarial first-read review 5 — Split Cost Slip

**Verdict: FAIL**

Reviewed 2026-08-29 at commit `c224612a6b1f4f551db29b4b4ccb080e513b780a` against <https://split-pass-through-costs.sociobot.in>. Product code was not changed. `.factory/brief.json` is absent, so scope was checked against the live product, README, design record, demo record, claims registry, every earlier review and polish record, verification record, and handoff.

The job, audience, first action, demo, claims, core workflow, privacy boundary, routes, accessibility baseline, and visual identity pass. PASS still requires zero findings. One minor plain-language defect remains on the 404 page.

## Finding — minor

### F-5-1 — The 404 headline uses a bill metaphor for a missing webpage

- Exact location/quote: live `/404.html` and every unknown path; eyebrow `404 / missing sheet`, h1 `This slip is not here.`, and body action context `Return to the cost splitter`.
- Evidence: an unknown path correctly returns HTTP 404 and focuses this h1. The wording is therefore the first explanation a visitor receives.
- Why this fails: `slip` elsewhere means the visitor's saved cost record, while `sheet` is used here only as a metaphor for a webpage. The attached plain-words rule prohibits metaphor headings and requires a heading to name its section out of context. This wording can imply that a saved slip disappeared instead of saying that the URL is missing.
- Concrete fix: use eyebrow `Page not found`, h1 `We cannot find this page.`, and body `Check the address, return home, or open the sample.` Keep the existing `Return home` and `Open the demo` actions. Add those exact plain labels to the route-copy test.

## Thirty-second cold read

| Fresh view | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Splits a supplier bill into costs billed to a client and costs kept as overhead. | Contractors billing materials. | `Try it with sample data`; adjacent copy says a completed supplier bill opens. | PASS |
| 1366×900 | Same. | Same. | Same; the action and all three facts are visible without scrolling. | PASS |

Exact first-screen text: `Split one bill into billable and overhead costs.`, `For contractors who need to separate client costs from their own overhead.`, `Try it with sample data`, and `The sample opens a completed supplier bill.` Both views answer what it does, who it is for, and what to click first. Neither view had horizontal overflow or a console error.

## Copy audit

Counts treat hyphenated terms as one word. The tables include every sentence and sentence-like unit on the landing page, the reachable extraction panel, and README. No sentence exceeds 22 words or uses a banned marketing adjective. The landing and README copy have no flag; F-5-1 is route copy outside those two requested sources.

### Landing page sentences

| Words | Exact copy | Check |
| ---: | --- | --- |
| 4 | `For contractors billing materials` | Audience label |
| 8 | `Split one bill into billable and overhead costs.` | Job headline |
| 12 | `For contractors who need to separate client costs from their own overhead.` | Audience sentence |
| 7 | `The sample opens a completed supplier bill.` | `demo-isolation` |
| 5 | `Your real bill starts empty.` | First-step fact |
| 4 | `Saved in this browser` | `slip-persistence` |
| 6 | `Works offline after the first visit` | `offline-reload` |
| 5 | `Saving and exports are free` | `free-core` |
| 3 | `One supplier bill.` | Image caption |
| 4 | `Billable costs and overhead.` | Image caption |
| 7 | `Split one supplier bill in three steps.` | How-it-works heading |
| 3 | `Enter the bill.` | Step heading |
| 7 | `Add the supplier total and optional attachment.` | `attachment-boundary` |
| 3 | `Divide each cost.` | Step heading |
| 7 | `Mark every cost row billable or overhead.` | `split-export` |
| 3 | `Export the split.` | Step heading |
| 11 | `Save a CSV or a client line list when it balances.` | `split-export`, `client-output` |
| 4 | `No saved slips yet.` | Empty state |
| 7 | `Your first balanced bill will appear here.` | Empty-state action cue |
| 7 | `Backup files contain slip details, not attachments.` | `backup-omits-attachments` |
| 4 | `Required fields are marked *.` | Form instruction |
| 4 | `Use two decimal places.` | Form instruction |
| 9 | `Include tax if it is on the supplier bill.` | Form instruction |
| 12 | `Images and PDFs up to 10 MB are saved in this browser.` | `attachment-boundary` |
| 3 | `No attachment yet` | Empty state |
| 6 | `Optional: extraction uses your Sociobot key.` | `bill-extraction` |
| 5 | `Manual entry still works offline.` | `offline-reload` |
| 11 | `Billable means you plan to charge the client for that row.` | Definition |
| 11 | `Enter the bill total and cost rows to check the split.` | Empty-state instruction |
| 13 | `Each row keeps its supplier bill reference, category, and billable or overhead choice.` | `split-export` |
| 8 | `Check your bookkeeping and tax treatment before importing.` | Guidance |
| 10 | `Split Cost Slip does not give tax or accounting advice.` | Limitation |
| 3 | `It splits bills.` | Limitation heading |
| 6 | `It does not replace accounting software.` | Limitation heading |
| 8 | `The demo sends no requests to other websites.` | `local-privacy` |
| 11 | `Keep original attachments and check every export before accounting or invoicing.` | Guidance |
| 11 | `Split Cost Slip separates one bill into billable costs and overhead.` | Footer summary |
| 4 | `Extract editable bill details.` | Extraction heading |
| 15 | `The named attachment goes to the Sociobot gateway only after you choose Extract bill details.` | `bill-extraction` |
| 10 | `Supplier, reference, date, total, and line items may be returned.` | `bill-extraction` |
| 5 | `You choose billable or overhead.` | `bill-extraction` |
| 10 | `The key stays in this browser until you remove it.` | `bill-extraction` |
| 6 | `Get a key at sociobot.in (external).` | External destination link |
| 6 | `This demo uses a recorded result.` | `bill-extraction` |
| 5 | `It sends no request.` | `local-privacy` |
| 3 | `Edit each suggestion.` | Extraction instruction |
| 9 | `Choose billable or overhead for every line before applying.` | `bill-extraction` |
| 3 | `Suggestions are ready.` | Result state |
| 8 | `Check every field and choose each line's treatment.` | Result instruction |

### README sentences

| Words | Exact copy | Check |
| ---: | --- | --- |
| 9 | `Split one supplier bill into billable costs and overhead.` | Job summary |
| 14 | `It is for contractors who need to separate client costs from their own overhead.` | Audience sentence |
| 9 | `Attach the supplier bill and enter each cost row.` | Workflow |
| 6 | `Mark each row billable or overhead.` | `split-export` |
| 7 | `Export a CSV or client line list.` | `split-export`, `client-output` |
| 15 | `CSV keeps each row's supplier bill reference, category, amount, currency, and billable or overhead choice.` | `split-export` |
| 12 | `Client line lists and printed client line lists include billable rows only.` | `client-output` |
| 12 | `Images and PDFs up to 10 MB are stored in this browser.` | `attachment-boundary` |
| 8 | `Saved slips and attachments stay in this browser.` | `slip-persistence` |
| 9 | `Exact cent totals show balanced, under, and over states.` | `cent-balance` |
| 9 | `JSON backups export saved slip details without attachment files.` | `backup-omits-attachments` |
| 10 | `A separate sample demo never reads or writes real slips.` | `demo-isolation` |
| 10 | `Install Split Cost Slip as an app in supported browsers.` | `installable-app` |
| 7 | `It works offline after the first visit.` | `offline-reload` |
| 5 | `Saving and exports are free.` | `free-core` |
| 13 | `Optional extraction sends the named attachment to Sociobot only after you start it.` | `bill-extraction` |
| 10 | `It uses your Sociobot key and returns editable bill details.` | `bill-extraction` |
| 9 | `You choose billable or overhead for every suggested line.` | `bill-extraction` |
| 5 | `Manual entry remains available offline.` | `offline-reload` |
| 11 | `Split Cost Slip does not replace accounting software or provide tax advice.` | Limitation |
| 5 | `Requires Node.js 20 or newer.` | Verified setup fact |
| 5 | `Vite prints the local URL.` | Verified setup fact |
| 8 | `Real records use browser storage for that origin.` | `manual-data-privacy` |
| 6 | `The demo uses separate browser storage.` | `demo-isolation` |
| 4 | `Playwright 1.58.2 is pinned.` | Verified package fact |
| 10 | `If Chromium is missing, run npx playwright install chromium once.` | Setup instruction |
| 12 | `npm test runs money, desktop, mobile, accessibility, privacy, extraction, and offline tests.` | Verified test-scope fact |
| 7 | `The production build is npm run build.` | Verified build instruction |
| 5 | `Deploy the generated dist/ directory.` | Deployment instruction |
| 7 | `Every visitor-facing claim is listed in .factory/claims.json.` | Registry check passed |
| 8 | `Run each listed command from a fresh checkout.` | Verification instruction |
| 5 | `Demo details are in .factory/demo.md.` | Documentation pointer |
| 8 | `The demo sends no requests to other websites.` | `local-privacy` |
| 10 | `Manual bill entry, storage, and exports stay in this browser.` | `manual-data-privacy` |
| 12 | `Extraction sends the named attachment to api.sociobot.in only after you start it.` | `bill-extraction` |
| 8 | `Your key remains removable from the extraction panel.` | `bill-extraction` |
| 9 | `Backup files omit attachments, so keep original attachments separately.` | `backup-omits-attachments` |

### Headings and controls

Landing headings name their sections: `How it works`, `Enter the supplier bill`, `Divide the bill into cost rows`, `Match the split to the bill total`, `Export the finished split`, `Privacy and limits`, and `Extract editable bill details`. README headings are `Split Cost Slip`, `What it includes`, `Develop`, `Test and build`, `Privacy and storage`, and `Project notes`; each is understandable in its document outline.

Action controls use result-naming verbs: `Try it with sample data`, `Enter my bill`, `Show saved slips`, `Create a new slip`, `Export backup`, `Import backup`, `Attach supplier bill`, `Open attachment`, `Extract bill details`, `Add cost row`, accessible names `Remove cost row n` and `Close extraction`, `Save slip`, `Export CSV`, `Copy client line list`, `Print client line list`, `Delete slip`, `Reset demo`, `Start for real`, `Remove saved key`, `Keep entering manually`, `Apply my choices`, `Discard suggestions`, `Undo`, and README link `Try the sample`. No inconsistent use was found for `supplier bill`, `attachment`, `cost row`, `billable`, `overhead`, or `client line list`.

## Demo and sandbox behaviour

The first-screen action reaches `/?demo=1` in one click. At 390×844, the first post-click screen already shows Sunrise Building Supply, reference `SBS-48192`, Juniper Kitchen Remodel, `$1,287.50`, `Balanced exactly`, two billable rows, and one overhead row. The persistent banner says `Demo — sample data, nothing is saved`, with `Reset demo` and `Start for real`.

In a fresh context, a saved real slip named `REVIEW FIVE REAL SUPPLIER` remained intact after entering demo, editing the sample, resetting, leaving, and reopening real mode. Reset restored Sunrise Building Supply. Leaving removed `split-cost-slip:demo`, opened an empty real workspace, and retained the real `split-cost-slip` database. Code separately selects those two IndexedDB databases and prevents demo reset outside demo mode.

The complete demo request log contained only the product origin. The live warm-offline check reloaded the demo, retained the sample, reported `Offline — ready to keep working`, and accepted an edit without a console error.

## Claims and clean-clone verification

Fresh clone: `/tmp/split-review5-clean.SKkBWi/repo`. `npm ci` reported zero vulnerabilities. Every exact command in `.factory/claims.json` was run independently in Chromium and Pixel 5 projects.

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS — seed, reset, exit, and real/demo separation |
| `split-export` | PASS — every seeded CSV row and promised field |
| `attachment-boundary` | PASS — image/PDF reload and 10,000,000/10,000,001-byte boundary |
| `local-privacy` | PASS — complete demo flow has no request to another website |
| `offline-reload` | PASS — warm offline demo reload and edit |
| `free-core` | PASS — save, reload, CSV, and copy without paywall |
| `client-output` | PASS — copied and printed output excludes overhead |
| `backup-omits-attachments` | PASS — details retained and attachment bytes omitted |
| `slip-persistence` | PASS — edited slip and attachment reload |
| `cent-balance` | PASS — exact balanced, under, and over states |
| `installable-app` | PASS — manifest, icons, worker, and Chromium installability |
| `manual-data-privacy` | PASS — real manual-data flow stays in-browser |
| `delete-slip-data` | PASS — saved details and attachment are removed together |
| `bill-extraction` | PASS — explicit send, fixture-backed editable facts, local removable key, user treatment, and undo |

No live landing, README, Privacy, or Terms product claim is absent from the registry. Setup/build facts were independently confirmed from package metadata and the clean-clone commands; they do not promise a product outcome. There is no untested product claim.

The full clean-clone gates also passed: 3 Vitest tests and 46 Playwright tests. `npm run build` emitted `dist/index.html`; the live asset names match that clean build. Main JavaScript is 41.07 kB raw / 12.66 kB gzip and CSS is 19.88 kB raw / 5.03 kB gzip.

## Structure, routes, accessibility, and identity

- `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, `/404.html`, and an unknown path have one h1, `lang=en`, one main landmark, route-specific title, description, canonical, OG/Twitter image, SVG favicon, and 180×180 touch icon.
- Unknown paths return HTTP 404. Root → Privacy, Back, unknown-path navigation, Back, and Forward each focus the destination h1 and expose the polite route announcement.
- All routes share the wordmark, three-link header, skip link, legal footer, external-link label, Param Factory attribution, and build id. Every crawled internal link, GitHub source link, and Sociobot key link returned 200.
- Live headers include CSP, frame denial, nosniff, strict referrer policy, immutable versioned assets, and `no-cache` on the worker. Normal loads had no console error.
- At 390 px, no route overflows and every visible link, button, or file action is at least 44×44 px. Axe reported zero WCAG 2 A/AA violations, not only zero serious/critical violations, on root, demo, Privacy, Terms, and 404.
- Focus is visible, labels are bound, the native extraction dialog restores focus, reduced motion is respected, and the generated artwork has useful alt text and fixed dimensions.
- The warm invoice paper, carbon rules, safety-orange marks, condensed broadsheet type, contractor-workbench image, and sheet layout match `.factory/design.md` and are distinct from a generic SaaS card/gradient template.
- The only structure/copy exception is F-5-1.

## Earlier-finding confirmation

Every earlier finding was checked against live behavior and current code/tests. None is merely accepted from a polish label. F-5-1 is a new 404-copy defect; the earlier F-1-43 routing defect remains fixed.

### Review 1

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-1-1 | Both cold viewports answer job, audience, and first action. |
| F-1-2, F-1-4, F-1-27 | Seeded demo, distinct databases, reset, exit, and real-data isolation pass. |
| F-1-3 | Fourteen registry entries have one unique tagged test each. |
| F-1-5, F-1-19, F-1-34 | Invalid money cannot retain balance, save, or export. |
| F-1-6, F-1-7, F-1-21, F-1-30, F-1-37 | Attachment-first storage, image/PDF reload, exact size boundary, association, and persistence pass. |
| F-1-8, F-1-18, F-1-20 | Complete split and CSV field/category assertions pass. |
| F-1-9–F-1-11, F-1-15–F-1-16, F-1-22, F-1-25, F-1-32, F-1-36 | Removed cap, Pro, checkout, merchant, and license claims/actions remain absent. |
| F-1-12 | Free save/export outcomes pass. |
| F-1-13 | Asset provenance remains in design documentation, not visitor marketing copy. |
| F-1-14, F-1-31 | Narrow demo and real-data privacy claims pass request interception. |
| F-1-17, F-1-28–F-1-29 | README scope matches the passing clean test/build commands and emitted `dist/index.html`. |
| F-1-23, F-1-33, F-1-35 | Client output, strict atomic import, and attachment-free backup checks pass. |
| F-1-24 | Offline reload, installability, responsive layout, and touch targets pass. |
| F-1-26, F-1-38 | Legal routes return 200 and have zero Axe violations. |
| F-1-39–F-1-40 | Security headers and versioned-only immutable caching pass live and in config. |
| F-1-41–F-1-42 | Mobile targets and the complete wordmark accessible name pass. |
| F-1-43 | Unknown routes no longer render home; they return the designed HTTP 404. Its new metaphor-copy defect is F-5-1. |
| F-1-44–F-1-46 | Route metadata, shared chrome, focus, and announcement pass every route. |
| F-1-47 | Landing order includes facts, live product, three steps, limits, and footer. |
| F-1-48–F-1-53 | Job h1 and supplier-bill, cost-row, balance, and output headings remain plain. |
| F-1-54–F-1-59 | Paid section/actions remain absent; sample and new-slip actions remain result-naming and keyboard-operable. |
| F-1-60–F-1-64 | Terminology and README sentence-length/jargon repairs remain fixed. |

### Review 2

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-2-1, F-2-17 | First demo viewport shows the completed sample; sample labels are consistent. |
| F-2-2 | Image, PDF, reload, and exact size-boundary assertions pass. |
| F-2-3, F-2-6–F-2-7 | CSV test asserts every promised field and category on all rows. |
| F-2-4, F-2-10 | Complete demo and real-mode request interception match the narrowed privacy wording. |
| F-2-5 | Free-core test proves outcomes, not enabled controls. |
| F-2-8, F-2-11 | Client copy/print and attachment-free backup/import paths pass. |
| F-2-9 | Installability has a registry entry and observable Chromium test. |
| F-2-12 | Persistence and exact cent states are listed and tested. |
| F-2-13–F-2-14 | Demo metadata and shared route chrome pass. |
| F-2-15–F-2-16 | Supplier bill, attachment, and client line list terminology remains consistent and plain. |

### Review 3

| Earlier id(s) | Current confirmation |
| --- | --- |
| F-3-1 | `/demo` has the 180×180 touch icon and complete route metadata. |
| F-3-2 | Static and fallback 404 headings receive focus on load, Back, and Forward. |
| F-3-3 | Real manual-entry privacy wording has its own passing request-interception claim. |
| F-3-4 | Live JS/CSS names are hashed; immutable caching covers only versioned assets. |
| F-3-5 | Output copy says balanced split; blocked unbalanced output matches it. |
| F-3-6–F-3-8 | Delete, storage-clearing removal, and narrowed Terms claims remain repaired. |
| F-3-9 | Every checked mobile target is at least 44×44 px. |
| F-3-10 | Saved/sample disclosure says `Show`/`Hide`, exposes state, and works by keyboard. |
| F-3-11–F-3-13 | Install/offline/privacy README copy remains plain and claim-backed. |
| F-3-14 | GitHub links visibly say `(external)`. |
| F-3-15 | Optional Sociobot extraction is explicit, editable, undoable, BYOK, fixture-tested, and has a manual/offline fallback. |

## Missed leverage

No missing obvious capability was found. Manual entry, attachment retention, CSV, billable-only copy/print, JSON backup/import, install/offline use, and optional factual bill extraction cover the brief implied by the available sources. Extraction uses only the Sociobot gateway after explicit action, shows the attachment name, stores a removable browser key, leaves treatment to the user, supports undo, and uses a recorded no-network demo result. No provider key is embedded. Sync would conflict with the documented local-first boundary.

## What would make this perfect

Replace the 404 `slip`/`sheet` metaphor with a literal page-not-found heading and add an exact route-copy assertion. Then rerun the same complete checklist. No other product change is indicated by this round.
