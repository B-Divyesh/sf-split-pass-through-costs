# Adversarial first-read review 4 — Split Cost Slip

**Verdict: PASS**

Reviewed 2026-08-28 at commit `0077b63df5d5336e94c89aeac377a632bf2f0768` against <https://split-pass-through-costs.sociobot.in>. Product code was not changed. `.factory/brief.json` is absent; scope was checked against the deployed product, README, design record, demo record, claims registry, prior reviews, polish records, verification record, and handoff.

There are no blocking, major, minor, unlisted-claim, or untested-claim findings in this round.

## Thirty-second cold read

| Fresh view | What it does | For whom | First action | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Splits a supplier bill into costs a contractor bills to a client and costs they keep as overhead. | Contractors billing materials. | `Try it with sample data`; the next line says it opens a completed supplier bill. | PASS |
| 1366×900 | Same. | Same. | Same; both primary and real-entry actions are above the fold. | PASS |

The exact first-screen text is `Split one bill into billable and overhead costs.`, `For contractors who need to separate client costs from their own overhead.`, `Try it with sample data`, and `The sample opens a completed supplier bill.` It answers the job, audience, and first click without scrolling. Both views had no console errors or horizontal overflow.

## Copy audit

Counts treat hyphenated terms as one word. The following is the complete landing-page and README sentence audit; headings, labels, and buttons were also checked for context and verb-led action names. No entry exceeds 22 words, uses a banned marketing adjective, contains unexplained product jargon, or changes the recorded terminology (`supplier bill`, `attachment`, `cost row`, `billable`, `overhead`, and `client line list`). All action controls name a result: for example, `Try it with sample data`, `Enter my bill`, `Export CSV`, `Copy client line list`, and `Create a new slip`.

### Landing page

| Words | Sentence or sentence-like unit | Check |
| ---: | --- | --- |
| 4 | For contractors billing materials | Audience label |
| 8 | Split one bill into billable and overhead costs. | Headline |
| 12 | For contractors who need to separate client costs from their own overhead. | Audience statement |
| 7 | The sample opens a completed supplier bill. | `demo-isolation` |
| 5 | Your real bill starts empty. | Accurate first-step instruction |
| 4 | Saved in this browser | `slip-persistence` |
| 6 | Works offline after the first visit | `offline-reload` |
| 5 | Saving and exports are free | `free-core` |
| 3 | One supplier bill. | Caption |
| 4 | Billable costs and overhead. | Caption |
| 7 | Split one supplier bill in three steps. | Contextual heading |
| 3 | Enter the bill. | Step |
| 7 | Add the supplier total and optional attachment. | `attachment-boundary` |
| 3 | Divide each cost. | Step |
| 7 | Mark every cost row billable or overhead. | `split-export` |
| 3 | Export the split. | Step |
| 11 | Save a CSV or a client line list when it balances. | `split-export`, `client-output` |
| 12 | No saved slips yet. Your first balanced bill will appear here. | Empty state |
| 7 | Backup files contain slip details, not attachments. | `backup-omits-attachments` |
| 4 | Required fields are marked *. | Form instruction |
| 4 | Use two decimal places. | Form instruction |
| 9 | Include tax if it is on the supplier bill. | Form instruction |
| 12 | Images and PDFs up to 10 MB are saved in this browser. | `attachment-boundary` |
| 6 | Optional: extraction uses your Sociobot key. | `bill-extraction` |
| 5 | Manual entry still works offline. | `offline-reload` |
| 11 | Billable means you plan to charge the client for that row. | Definition |
| 11 | Enter the bill total and cost rows to check the split. | Empty-state instruction |
| 13 | Each row keeps its supplier bill reference, category, and billable or overhead choice. | `split-export` |
| 8 | Check your bookkeeping and tax treatment before importing. | Guidance, not a promise |
| 10 | Split Cost Slip does not give tax or accounting advice. | Limitation |
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 11 | Keep original attachments and check every export before accounting or invoicing. | Guidance |
| 11 | Split Cost Slip separates one bill into billable costs and overhead. | Footer one-liner |

Demo-only, first-screen units were also checked: `Demo — sample data, nothing is saved` (6), `Sample records use separate browser storage.` (6), `Sunrise Building Supply` (3), `Supplier bill total` (3), `Balanced exactly` (2), and `Two billable rows · one overhead row` (6). They consistently identify a sample rather than real data.

### README

| Words | Sentence | Check |
| ---: | --- | --- |
| 9 | Split one supplier bill into billable costs and overhead. | Job summary |
| 14 | It is for contractors who need to separate client costs from their own overhead. | Audience statement |
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
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 10 | Manual bill entry, storage, and exports stay in this browser. | `manual-data-privacy` |
| 14 | Extraction sends the named attachment to `api.sociobot.in` only after you start it. | `bill-extraction` |
| 8 | Your key remains removable from the extraction panel. | `bill-extraction` |
| 9 | Backup files omit attachments, so keep original attachments separately. | `backup-omits-attachments` |
| 5 | Requires Node.js 20 or newer. | Setup fact |
| 5 | Vite prints the local URL. | Setup fact |
| 10 | Real records use browser storage for that origin. | Setup fact |
| 6 | The demo uses separate browser storage. | `demo-isolation` |
| 4 | Playwright 1.58.2 is pinned. | Developer instruction |
| 7 | If Chromium is missing, run `npx playwright install chromium` once. | Developer instruction |
| 13 | `npm test` runs money, desktop, mobile, accessibility, privacy, extraction, and offline tests. | Accurate test-scope description |
| 8 | The production build is `npm run build`. | Developer instruction |
| 5 | Deploy the generated `dist/` directory. | Developer instruction |
| 8 | Every visitor-facing claim is listed in `.factory/claims.json`. | Verified registry statement |
| 9 | Run each listed command from a fresh checkout. | Developer instruction |
| 7 | Demo details are in `.factory/demo.md`. | Developer instruction |

README limitation statements (`Split Cost Slip does not replace accounting software or provide tax advice.`) and document links are clear context, not unproved product outcomes. The live root, README, Privacy, and Terms contain no claim-like sentence absent from `.factory/claims.json`.

## Demo and sandbox behaviour

The visible one-click action reaches `/?demo=1` (and `/demo`) and immediately presents a realistic completed Sunrise Building Supply bill: `SBS-48192`, Juniper Kitchen Remodel, $1,287.50, two billable material rows, one overhead delivery row, and `Balanced exactly`. The persistent banner says `Demo — sample data, nothing is saved` and exposes both `Reset demo` and `Start for real`.

In a fresh context, a saved real slip remained intact after entering demo, editing the demo supplier, resetting, leaving demo, and reopening real mode. Reset restored the Sunrise sample; leaving demo discarded demo storage and opened an empty real bill. Code confirms distinct IndexedDB databases (`split-cost-slip` versus `split-cost-slip:demo`) and prevents `resetDemoStorage` outside demo mode. The tagged demo and privacy tests exercise this flow with request interception; the offline tagged test performs a warm demo load, sets the context offline, reloads, and edits the sample successfully.

## Claims and clean-clone verification

Fresh clone used: `/tmp/split-review4-clean.kP7jbF/repo`. `npm ci` completed with zero reported vulnerabilities. Each command listed in `.factory/claims.json` was run independently, with its desktop Chromium and Pixel 5 instances passing:

| Claim | Result |
| --- | --- |
| `demo-isolation` | PASS — seeded sample, reset, real/demo separation |
| `split-export` | PASS — all seeded CSV fields and rows |
| `attachment-boundary` | PASS — image/PDF reload and 10 MB boundary |
| `local-privacy` | PASS — complete demo flow makes no other-site request |
| `offline-reload` | PASS — warm offline demo reload and edit |
| `free-core` | PASS — save, reload, export, copy without paywall |
| `client-output` | PASS — copy and print exclude overhead rows |
| `backup-omits-attachments` | PASS — details retained, attachment bytes omitted |
| `slip-persistence` | PASS — edited slip and attachment reload |
| `cent-balance` | PASS — exact balanced, under, and over states |
| `installable-app` | PASS — manifest, service worker, Chromium installability |
| `manual-data-privacy` | PASS — manual real-data flow stays local |
| `delete-slip-data` | PASS — saved details and attachment removed together |
| `bill-extraction` | PASS — recorded gateway fixture, explicit send, editable facts, user treatment, undo, removable local key |

The complete clean-clone suite passed: 3 Vitest tests and 46 Playwright desktop/mobile tests. `npm run build` passed and emitted `dist/index.html`; production JavaScript is 12.66 kB gzip and CSS is 5.03 kB gzip.

## Structure, accessibility, and routes

- Root, Demo, Privacy, Terms, Offline, static 404, and a true unknown-path 404 each have one h1, an appropriate route title, plain meta description, canonical URL, OG/Twitter image, SVG favicon, and 180×180 touch icon.
- Direct unknown paths return HTTP 404 with the designed `This slip is not here.` page. Direct static-page, fallback-404, back, and forward checks focused the destination h1 and expose the polite route announcement.
- Root, demo, legal, offline, and 404 pages share the wordmark, three-link header, skip link, legal footer, external-link label, factory attribution, and build id. Crawling all internal and external links returned 200 or an in-page anchor.
- Live headers include CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and a strict referrer policy. Fingerprinted assets are immutable; the service worker is `no-cache`.
- The 390 px target-size test covers every visible link, button, and file action at 44×44 px or larger with no horizontal overflow. The route suite reports zero serious or critical Axe violations, and normal cold loads had no console errors.
- The visual identity is specific and coherent: warm invoice paper, carbon rules, safety-orange marks, condensed broadsheet typography, an original contractor-workbench bill image, and sheet-like rather than generic SaaS surfaces. It matches `.factory/design.md` and is distinct from a gradient/card template.

## Earlier-finding confirmation

Every prior finding was rechecked against live behavior and the corresponding implementation/test rather than accepted from a polish label. The compact matrix below names every earlier identifier.

| Earlier finding(s) | Confirmation |
| --- | --- |
| F-1-1, F-1-48–F-1-55, F-1-60–F-1-64 | Cold read, copy audit, terminology, headings, and action-label checks pass. |
| F-1-2, F-1-4, F-1-27; F-2-1, F-2-17 | Seeded isolated demo, banner, reset, exit, and consistent sample labels pass. |
| F-1-3–F-1-8, F-1-12, F-1-14, F-1-17–F-1-21, F-1-23–F-1-24, F-1-30–F-1-31, F-1-33–F-1-35, F-1-37; F-2-2–F-2-12; F-3-3, F-3-5–F-3-8, F-3-15 | Registry, tagged clean-sandbox claims, validation/import checks, real/demo privacy checks, attachment lifecycle, export/print/backup checks, and optional recorded extraction all pass. |
| F-1-9–F-1-11, F-1-15–F-1-16, F-1-22, F-1-25, F-1-32, F-1-36, F-1-54, F-1-57–F-1-59 | Removed paid, checkout, license, cap, and unsupported merchant claims/actions remain absent. |
| F-1-13 | Asset provenance remains correctly documented in the design record, not made as an untested visitor promise. |
| F-1-26, F-1-38, F-1-41–F-1-42; F-3-9–F-3-10, F-3-14 | Legal routes, contrast/Axe checks, complete mobile target checks, accessible wordmark, disclosure action names, and external-link labels pass. |
| F-1-39–F-1-40; F-3-4 | Live CSP/anti-framing/nosniff/referrer headers and fingerprinted-only immutable caching pass. |
| F-1-43–F-1-47; F-2-13–F-2-14; F-3-1–F-3-2 | Designed 404, route-specific metadata including Demo touch icon, shared chrome, focused/announced route changes, and landing information order pass. |
| F-1-28–F-1-29, F-1-56 | Documented test/build instructions match the passing suite and build; `Create a new slip` remains keyboard-operable and result-naming. |
| F-2-15–F-2-16; F-3-11–F-3-13 | Current visitor and README copy retains plain wording without the prior terminology or implementation-jargon regressions. |

## Missed-leverage check

No missing obvious capability was found. Contractors can enter data manually, attach the source bill, export CSV, copy/print client-only lines, back up/import saved details, and install/use the PWA offline. The useful optional enhancement—bill-detail extraction—is implemented through the Sociobot gateway only after explicit action, names the file to be sent, uses a removable browser-stored key, supplies editable facts, requires the user to choose treatment, supports undo, and uses a non-network recorded result in demo mode. No provider key is embedded.

## What would make this perfect

Maintain this evidence discipline as features change: keep the first-screen wording short, keep the demo contract isolated, and add a narrowly observable claim test before publishing any new promise. No product change is required for this round.
