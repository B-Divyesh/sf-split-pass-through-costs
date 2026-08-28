# Adversarial first-read review 3 — Split Cost Slip

**Verdict: FAIL**

Reviewed 2026-08-28 at commit `352fc98c021ce1c3cc2d3cf5884412bcca73cf3c` against <https://split-pass-through-costs.sociobot.in>. The live JavaScript and CSS hashes match the clean build. Product code was not changed. `.factory/brief.json` is absent, so scope checks used the deployed product, README, design record, claims registry, demo record, every prior review/polish file, verification, and handoff.

The first read, one-click demo, core workflow, registered claim commands, route crawl, visual identity, and serious/critical axe checks pass. PASS still requires zero findings. Four earlier findings are only partly fixed and therefore reopen as blockers. The legal copy also contains unlisted or inaccurate claims.

## Findings — blocking

### F-3-1 / F-2-13 / F-1-44 (reopened) — `/demo` still has the wrong apple-touch metadata

- Exact location: live `/demo` and `demo/index.html`.
- Evidence: `/demo` contains `<link rel="apple-touch-icon" href="/icons/icon-192.png">`, with no `sizes` attribute. The referenced image is 192×192. Root, Privacy, Terms, and 404 correctly use `/icons/apple-touch-icon.png` with `sizes="180x180"`.
- Why this fails: F-1-44 required the 180 px touch icon on every route. F-2-13 was marked repaired, but the demo entry point was missed. The route-metadata test checks only Privacy, Terms, and 404, so it cannot catch this regression.
- Concrete fix: use `<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">` in `demo/index.html`. Extend the route metadata test to cover `/` and `/demo` and assert the exact `sizes` and `href` values on all routes.

### F-3-2 / F-1-46 (reopened) — The 404 route does not focus its heading

- Exact location: live `/review-3-not-found`; heading `This slip is not here.`
- Evidence: after the 404 document loads, `document.activeElement` is `BODY`. Privacy focuses `Your bills stay in your browser.`, and browser Back focuses the root h1, but the 404 h1 has neither `autofocus` nor a script that calls `focus()`.
- Why this fails: F-1-46 explicitly required focus and announcement for deep links and the 404. The repair test checks metadata and chrome but never asserts focus.
- Concrete fix: focus the 404 h1 on load and keep the live-region announcement. Add a browser test that navigates from a known route to an unknown route, then checks the h1 after forward and Back navigation.

### F-3-3 / F-2-10 / F-1-31 (reopened) — A broad privacy claim remains outside the demo-only test

- Exact quote/location: Privacy, `We do not receive, read, or sync them.`
- Evidence: `local-privacy` tests only the demo namespace and says only that the complete demo flow sends no cross-origin requests. No claims entry or tagged test covers a real-data flow or same-origin transmission. The root CSP is useful evidence, but it is not the registered behavioral proof promised by the claims contract.
- Why this fails: the visitor can rely on a broader statement about all real bills than the test establishes. F-1-31/F-2-10 were marked fixed by removing broad privacy wording, but this equivalent wording remains on a live route.
- Concrete fix: either change the sentence to the listed demo claim, or add a separate `real-data-network-privacy` claim that intercepts a complete real-mode flow and asserts no data-bearing requests leave browser storage.

### F-3-4 / F-1-40 (reopened) — The stable CSS URL is cached as immutable for one year

- Exact location: live `/assets/app.css`; `vite.config.ts`; `public/staticwebapp.config.json`.
- Evidence: the built root and demo both load the unversioned URL `/assets/app.css`. Its live response says `Cache-Control: public, max-age=31536000, immutable`. The JavaScript URL is content-hashed (`/assets/main-ZnuxMIVP.js`), but the CSS filename is forced to `assets/app.css` while the host applies the immutable rule to every `/assets/*` response.
- Why this fails: F-1-40 required immutable caching for hashed assets. This is only half-fixed: a returning browser can retain old CSS after a deployment and combine it with new HTML/JavaScript. The prior polish and handoff incorrectly call all immutable assets hashed.
- Concrete fix: emit CSS as `assets/app-[hash].css` and keep immutable caching, or serve stable CSS with revalidation/no-cache. Add a production-build test that rejects any unversioned URL carrying `immutable`, plus a deployed-header check.

## Findings — major

### F-3-5 — Privacy says CSV and client output work “at any time,” but they do not

- Exact quote/location: Privacy → Your control, `Export a CSV, client line list, or JSON backup at any time.`
- Evidence: from `/?new=1`, `Export CSV` produces no download and reports `Match the split to the bill total before exporting.` Client output is blocked for the same reason. No claims entry contains the words `at any time`.
- Why this fails: the legal page promises availability that the product deliberately withholds until a split balances.
- Concrete fix: use `When the split balances, export a CSV or client line list. Export a JSON backup of saved slip details at any time.` Add a listed JSON-backup export claim if the second sentence is retained.

### F-3-6 — Attachment deletion is an unlisted claim

- Exact quote/location: Privacy → Your control, `Delete a slip to remove its attachment.`
- Evidence: no `.factory/claims.json` entry or tagged test deletes a saved slip and confirms that both the slip and attachment blob are gone.
- Why this fails: a visitor may rely on deletion for privacy, but the claimed result has no sandbox proof.
- Concrete fix: add a `delete-slip-data` claim and test that saves a slip and attachment, deletes it, reloads, and checks both IndexedDB stores. Otherwise remove the sentence.

### F-3-7 — Clearing-site-data behavior is an unlisted claim

- Exact quote/location: Privacy → Your control, `Clearing site data removes local records.`
- Evidence: no claims entry or tagged test clears origin storage and confirms that real and demo records disappear.
- Why this fails: this is a privacy outcome a visitor can rely on, but it is omitted from the claims inventory.
- Concrete fix: add a `clear-site-data` claim with a clean-context storage-clear test, or replace it with browser-specific guidance that is not framed as a product guarantee.

### F-3-8 — The Terms page makes a broader free-use claim than the registry

- Exact quote/location: Terms → Use and records, `The product is free to use.`
- Evidence: `free-core` lists only `Saving and exports are free` and tests save, CSV, and client-copy outcomes. It does not list the broader whole-product sentence.
- Why this fails: the claims inventory says every visitor-facing claim is listed, but this one is not.
- Concrete fix: change the Terms sentence to the exact registered promise, or expand `free-core` and its test to cover every product action implied by `free to use`.

### F-3-9 — Several mobile targets are below the required 44×44 px

- Exact locations and live 390 px measurements: root/demo header `Demo` 42.7×24.8, `Privacy` 52.5×24.8, `Terms` 43.6×24.8; legal/404 wordmark 149.7×16; 404 `Return home` 88.3×19 and `Open the demo` 103.9×19.
- Why this fails: the accessibility contract requires every touch target to be at least 44×44 CSS px. Axe reports no serious/critical violations because this project rule is stricter than the rules exercised.
- Concrete fix: give every header link, wordmark, and 404 action a minimum 44 px block size without crowding adjacent targets. Add bounding-box assertions at 390 px for all visible links and buttons, not only footer links.

## Findings — minor

### F-3-10 — The saved-list disclosure buttons do not name their result

- Exact controls: root `Saved slips 0`; demo `Sample slips 1`.
- Why this fails: these are buttons, but their labels are nouns and do not say what pressing them will do.
- Concrete fix: use `Show saved slips (0)` / `Hide saved slips (0)` and `Show sample slips (1)` / `Hide sample slips (1)` based on `aria-expanded`.

### F-3-11 — The install/offline README sentence is jargon and assigns behavior to the wrong object

- Exact quote: `An installable app manifest works offline after the first visit.`
- Why this fails: visitors do not use a manifest, and a manifest is not what works offline.
- Concrete fix: use `Install Split Cost Slip as an app. It works offline after the first visit.` Strengthen `installable-app` to check Chromium installability errors before making the first sentence.

### F-3-12 — `offline-reload` is internal test jargon in the README

- Exact quote: ``npm test` runs money, desktop, mobile, accessibility, and offline-reload tests.`
- Why this fails: `offline-reload` reads like an internal tag rather than plain documentation.
- Concrete fix: use ``npm test` runs money, desktop, mobile, accessibility, and offline tests.`

### F-3-13 — `cross-origin request` is implementation jargon in user-facing privacy copy

- Exact quote: `The complete demo flow sends no cross-origin request.`
- Why this fails: a normal visitor should not need browser-security vocabulary to understand the privacy boundary.
- Concrete fix: use `The demo sends no requests to other websites.` Update the claim wording to match.

### F-3-14 — The external Source link is not identified as external

- Exact location: every footer, `Source`, linking to GitHub.
- Why this fails: the site-structure contract requires external links to say so. The current label gives no warning that it leaves the product origin.
- Concrete fix: label it `Source on GitHub (external)` or add equivalent visible and accessible text.

### F-3-15 — Attaching a bill does not help enter its data

- Exact location: workspace action `Attach supplier bill` and the fully manual supplier/reference/date/total/row fields below it.
- Why this is missed leverage: a contractor attaching an image or PDF would reasonably expect help transcribing the bill. The attachment currently acts only as local archive evidence.
- Concrete feature: add optional `Extract bill details (uses your Sociobot key)`. Show exactly which attachment is sent, return editable supplier/reference/date/total/line-item suggestions, require confirmation, and never decide billable versus overhead. Keep manual/offline entry, use a canned demo result, and test the gateway path with a recorded fixture and no embedded provider key.

## Thirty-second cold read

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844, fresh context | Splits one bill into billable costs and overhead. | Contractors billing materials who separate client costs from their own overhead. | `Try it with sample data`; the adjacent line says a completed supplier bill opens. | PASS |
| 1366×900, fresh context | Same answer. | Same answer. | The sample action is fully visible at y=712–760. | PASS |

Exact first-screen copy: `Split one bill into billable and overhead costs.`, `For contractors who need to separate client costs from their own overhead.`, `Try it with sample data`, and `The sample opens a completed supplier bill.` All three facts are visible at both sizes. The desktop third fact ends at y=890.5 in the 900 px viewport.

## Demo and sandbox evidence

| Check | Result |
| --- | --- |
| One-click entry | PASS — the first-screen action opens `/demo` in one click. |
| First post-click screen | PASS — at 390×844 it shows Sunrise Building Supply, SBS-48192, $1,287.50, balanced status, and all three realistic rows before the editor. |
| Banner | PASS — `Demo — sample data, nothing is saved`, separate-storage note, `Reset demo`, and `Start for real` are visible. |
| Reset | PASS — changing the supplier and resetting restores `Sunrise Building Supply`. |
| Isolation | PASS — a saved `REAL PRIVATE SUPPLIER` remains unchanged after demo edits and reset. Demo exit removes `split-cost-slip:demo`; real `split-cost-slip` remains. |
| Start for real | PASS — opens `/?new=1` with an empty supplier field. |
| Network privacy | PASS for the registered sandbox — the full tagged flow records no cross-origin requests. The broader real-data legal claim is F-3-3. |
| Offline | PASS live — after warm load and network interception, offline reload keeps the sample and reports `Offline — ready to keep working`. |

## Claims registry execution

Clean clone: `/tmp/split-review3-clean.Tz0jFY/repo`. Every command was run separately. Each passed in desktop Chromium and Pixel 5 projects.

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-isolation` | `npm run test:claims -- --grep @claim:demo-isolation` | PASS — 2/2 |
| `split-export` | `npm run test:claims -- --grep @claim:split-export` | PASS — 2/2 |
| `attachment-boundary` | `npm run test:claims -- --grep @claim:attachment-boundary` | PASS — 2/2 |
| `local-privacy` | `npm run test:claims -- --grep @claim:local-privacy` | PASS — 2/2 |
| `offline-reload` | `npm run test:claims -- --grep @claim:offline-reload` | PASS — 2/2 |
| `free-core` | `npm run test:claims -- --grep @claim:free-core` | PASS — 2/2 |
| `client-output` | `npm run test:claims -- --grep @claim:client-output` | PASS — 2/2 |
| `backup-omits-attachments` | `npm run test:claims -- --grep @claim:backup-omits-attachments` | PASS — 2/2 |
| `slip-persistence` | `npm run test:claims -- --grep @claim:slip-persistence` | PASS — 2/2 |
| `cent-balance` | `npm run test:claims -- --grep @claim:cent-balance` | PASS — 2/2 |
| `installable-app` | `npm run test:claims -- --grep @claim:installable-app` | PASS — 2/2 |

Registered claims are tested. F-3-3 and F-3-5 through F-3-8 identify live claim-like sentences that are absent from, or broader than, the registry.

Additional clean-clone gates:

- `npm test`: PASS — 3 unit tests and 30 browser runs.
- `npm run build`: PASS — `dist/` emitted; JavaScript 29.33 kB raw / 9.49 kB gzip and CSS 18.39 kB raw / 4.78 kB gzip.
- Factory URL verifier: PASS after creating its output directory; title, `lang`, one h1, main, alt text, labels, and zero console errors.
- Live axe: zero serious/critical WCAG 2 A/AA findings on root, demo, Privacy, Terms, and 404.

## Copy audit

Counts treat hyphenated terms as one word and exclude standalone symbols. No landing or README sentence exceeds 22 words. No banned marketing adjective appears. Findings are referenced in the Result column.

### Landing-page sentences, headings, and sentence-like units

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | `For contractors billing materials` | OK |
| 8 | `Split one bill into billable and overhead costs.` | OK |
| 12 | `For contractors who need to separate client costs from their own overhead.` | OK |
| 7 | `The sample opens a completed supplier bill.` | Listed: demo-isolation |
| 5 | `Your real bill starts empty.` | Listed: demo-isolation |
| 4 | `Saved in this browser` | Listed: slip-persistence |
| 6 | `Works offline after the first visit` | Listed: offline-reload |
| 5 | `Saving and exports are free` | Listed: free-core |
| 3 | `One supplier bill.` | OK |
| 4 | `Billable costs and overhead.` | OK |
| 3 | `How it works` | Standard skeleton label |
| 7 | `Split one supplier bill in three steps.` | OK |
| 3 | `Enter the bill.` | OK |
| 7 | `Add the supplier total and optional attachment.` | Listed: attachment-boundary |
| 3 | `Divide each cost.` | OK |
| 7 | `Mark every cost row billable or overhead.` | Listed: split-export |
| 3 | `Export the split.` | Listed: split-export |
| 11 | `Save a CSV or a client line list when it balances.` | Listed: split-export/client-output |
| 4 | `No saved slips yet.` | OK |
| 7 | `Your first balanced bill will appear here.` | OK |
| 7 | `Backup files contain slip details, not attachments.` | Listed: backup-omits-attachments |
| 4 | `Enter the supplier bill.` | OK |
| 4 | `Required fields are marked *.` | OK |
| 4 | `Use two decimal places.` | OK |
| 9 | `Include tax if it is on the supplier bill.` | OK |
| 4 | `Attach the supplier bill` | OK |
| 12 | `Images and PDFs up to 10 MB are saved in this browser.` | Listed: attachment-boundary |
| 3 | `No attachment yet` | OK |
| 6 | `Divide the bill into cost rows.` | OK |
| 11 | `Billable means you plan to charge the client for that row.` | OK |
| 7 | `Match the split to the bill total.` | OK |
| 11 | `Enter the bill total and cost rows to check the split.` | OK |
| 4 | `Export the finished split.` | OK |
| 13 | `Each row keeps its supplier bill reference, category, and billable or overhead choice.` | Listed: split-export |
| 8 | `Check your bookkeeping and tax treatment before importing.` | OK |
| 10 | `Split Cost Slip does not give tax or accounting advice.` | OK |
| 3 | `Privacy and limits` | OK |
| 3 | `It splits bills.` | OK |
| 6 | `It does not replace accounting software.` | OK |
| 6 | `The demo sends no outside requests.` | Listed: local-privacy |
| 12 | `Keep supplier bill files and check every export before accounting or invoicing.` | OK |
| 11 | `Split Cost Slip separates one bill into billable costs and overhead.` | OK |
| 6 | `Built by Param Factory · build polish-2` | OK |

### Landing and demo controls

| Words | Exact control | Result |
| ---: | --- | --- |
| 1 | `Demo` | Destination link |
| 1 | `Privacy` | Destination link |
| 1 | `Terms` | Destination link |
| 5 | `Try it with sample data` | OK |
| 3 | `Enter my bill` | OK |
| 2 | `Saved slips` / `Sample slips` | F-3-10 |
| 4 | `Create a new slip` | OK |
| 2 | `Export backup` | OK |
| 2 | `Import backup` | OK |
| 3 | `Attach supplier bill` | OK |
| 2 | `Open attachment` | OK |
| 3 | `Add cost row` | OK |
| 3 | `Remove cost row` | OK |
| 2 | `Save slip` | OK |
| 2 | `Export CSV` | OK |
| 4 | `Copy client line list` | OK |
| 4 | `Print client line list` | OK |
| 2 | `Delete slip` | OK |
| 2 | `Reset demo` | OK |
| 3 | `Start for real` | Required demo exit wording |

### README sentences, headings, and sentence-like units

| Words | Exact copy | Result |
| ---: | --- | --- |
| 3 | `Split Cost Slip` | OK |
| 9 | `Split one supplier bill into billable costs and overhead.` | OK |
| 14 | `It is for contractors who need to separate client costs from their own overhead.` | OK |
| 9 | `Attach the supplier bill and enter each cost row.` | OK |
| 6 | `Mark each row billable or overhead.` | OK |
| 7 | `Export a CSV or client line list.` | Listed: split-export/client-output |
| 3 | `Try the sample` | OK |
| 3 | `What it includes` | Understandable under the product h1 |
| 17 | `CSV keeps each cost row's supplier bill reference, category, amount, currency, and billable or overhead choice.` | Listed: split-export |
| 12 | `Client line lists and printed client line lists include billable rows only.` | Listed: client-output |
| 12 | `Images and PDFs up to 10 MB are stored in this browser.` | Listed: attachment-boundary |
| 8 | `Saved slips and attachments stay in this browser.` | Listed: slip-persistence |
| 9 | `Exact cent totals show balanced, under, and over states.` | Listed: cent-balance |
| 8 | `Backup files contain slip details, not attachment files.` | Listed: backup-omits-attachments |
| 10 | `A separate sample demo never reads or writes real slips.` | Listed: demo-isolation |
| 10 | `An installable app manifest works offline after the first visit.` | F-3-11 |
| 5 | `Saving and exports are free.` | Listed: free-core |
| 3 | `It splits bills.` | OK |
| 10 | `It does not replace accounting software or provide tax advice.` | OK |
| 1 | `Develop` | Developer heading |
| 5 | `Requires Node.js 20 or newer.` | Developer instruction |
| 5 | `Vite prints the local URL.` | Developer instruction |
| 8 | `Real records use browser storage for that origin.` | Listed: slip-persistence |
| 6 | `The demo uses separate browser storage.` | Listed: demo-isolation |
| 3 | `Test and build` | Developer heading |
| 4 | `Playwright 1.58.2 is pinned.` | Developer instruction |
| 10 | `If Chromium is missing, run npx playwright install chromium once.` | Developer instruction |
| 10 | ``npm test` runs money, desktop, mobile, accessibility, and offline-reload tests.` | F-3-12 |
| 12 | `The production build is npm run build; deploy the generated dist/ directory.` | Developer instruction; verified |
| 7 | `Every visitor-facing claim is listed in .factory/claims.json.` | False while F-3-3 and F-3-5 through F-3-8 remain |
| 8 | `Run any listed command from a fresh checkout.` | Developer instruction; verified |
| 10 | `The sample route and reset behavior are documented in .factory/demo.md.` | Developer instruction; verified |
| 3 | `Privacy and storage` | OK |
| 8 | `The complete demo flow sends no cross-origin request.` | F-3-13; listed behavior |
| 10 | `Backup files omit attachments, so keep supplier bill files separately.` | Listed: backup-omits-attachments |
| 2 | `Project notes` | OK |
| 6 | `Visual rationale and image provenance: .factory/design.md` | Developer reference |
| 3 | `Delivery evidence: .factory/handoff.md` | Developer reference |
| 2 | `License: MIT` | OK |

## Earlier finding verification

Every earlier review finding was checked against the live site and current code. Reopened items retain their earlier IDs and are blocking above.

### Review 1

| Earlier id | Status | Current evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Both cold viewports answer job, audience, and first action. |
| F-1-2 | Fixed | Seeded demo, reset, exit, and separate databases pass live. |
| F-1-3 | Fixed | Eleven registered claims and unique tagged tests exist. |
| F-1-4 | Fixed | Demo/real storage isolation passes. |
| F-1-5 | Fixed | Invalid values block balance, save, and export. |
| F-1-6 | Fixed | Image/PDF attachment persistence passes. |
| F-1-7 | Fixed | 10,000,000/10,000,001-byte boundary is tested. |
| F-1-8 | Fixed | Every CSV row and promised field is parsed and asserted. |
| F-1-9 | Fixed | Five-slip cap and copy are absent. |
| F-1-10 | Fixed | Dead $19 offer is absent. |
| F-1-11 | Fixed | Pro archive claim is absent. |
| F-1-12 | Fixed | Free save/export outcomes pass. |
| F-1-13 | Fixed | Footer provenance marketing claim is absent. |
| F-1-14 | Fixed | Demo network claim is narrow and intercepted. |
| F-1-15 | Fixed | Checkout wording and link are absent. |
| F-1-16 | Fixed | Merchant/refund wording is absent. |
| F-1-17 | Fixed | README opener is short and contractor-specific. |
| F-1-18 | Fixed | Split/export and attachment paths pass. |
| F-1-19 | Fixed | Invalid decimals announce an error and block output. |
| F-1-20 | Fixed | Categories are asserted on every exported row. |
| F-1-21 | Fixed | Image/PDF retention and boundary tests pass. |
| F-1-22 | Fixed | Capped/Pro archive claims are absent. |
| F-1-23 | Fixed | Client copy/print and backup tests pass; F-3-5 is new legal wording. |
| F-1-24 | Fixed | Offline and manifest claims pass; 390 px has no overflow. |
| F-1-25 | Fixed | Paid-license claim is absent. |
| F-1-26 | Fixed | Legal pages return 200 and pass serious/critical axe checks. |
| F-1-27 | Fixed | Real/demo databases remain separate. |
| F-1-28 | Fixed | README suite description matches `npm test`. |
| F-1-29 | Fixed | Build emits `dist/index.html`. |
| F-1-30 | Fixed | Slip/attachment association survives reload. |
| F-1-31 | **Reopened** | Privacy retains a broad real-data claim; F-3-3. |
| F-1-32 | Fixed | License request code and claim are absent. |
| F-1-33 | Fixed | Backup bytes omission is listed and tested. |
| F-1-34 | Fixed | Invalid-money regression passes. |
| F-1-35 | Fixed | Malformed import is rejected atomically. |
| F-1-36 | Fixed | Purchase UI/calls are absent. |
| F-1-37 | Fixed | Attachment-only records persist. |
| F-1-38 | Fixed | Legal route contrast/axe checks pass. |
| F-1-39 | Fixed | Live CSP, frame denial, nosniff, and referrer policy are present. |
| F-1-40 | **Reopened** | Stable `/assets/app.css` is cached immutable for one year; F-3-4. |
| F-1-41 | Fixed | Earlier footer targets are 44×44; different targets fail in F-3-9. |
| F-1-42 | Fixed | Wordmark accessible name contains visible text. |
| F-1-43 | Fixed | Unknown route returns a designed HTTP 404. |
| F-1-44 | **Reopened** | Demo still uses the wrong touch icon; F-3-1. |
| F-1-45 | Fixed | Header/footer link sets and sitemap are consistent. |
| F-1-46 | **Reopened** | 404 leaves focus on BODY; F-3-2. |
| F-1-47 | Fixed | Three facts, three steps, and limits appear in order. |
| F-1-48 | Fixed | The h1 states the job in eight words. |
| F-1-49 | Fixed | Contractor audience wording is plain. |
| F-1-50 | Fixed | Supplier-bill heading is explicit. |
| F-1-51 | Fixed | Cost-row heading is explicit. |
| F-1-52 | Fixed | Balance heading is explicit. |
| F-1-53 | Fixed | Export heading names the result. |
| F-1-54 | Fixed | Paid section is absent. |
| F-1-55 | Fixed | Primary action is `Try it with sample data`. |
| F-1-56 | Fixed | `Create a new slip` remains keyboard operable. |
| F-1-57 | Fixed | Paid-details action is absent. |
| F-1-58 | Fixed | License-restore action is absent. |
| F-1-59 | Fixed | Buy-Pro action is absent. |
| F-1-60 | Fixed | Supplier bill, attachment, and client line list are consistent. |
| F-1-61 | Fixed | README opener is below 22 words. |
| F-1-62 | Fixed | README workflow uses short sentences. |
| F-1-63 | Fixed | README test sentence is below 22 words. |
| F-1-64 | Fixed | README introduction avoids accounting/implementation jargon. |

### Review 2

| Earlier id | Status | Current evidence |
| --- | --- | --- |
| F-2-1 | Fixed | First demo viewport shows the completed sample and rows. |
| F-2-2 | Fixed | Attachment claim covers image, PDF, reload, and exact upper boundary. |
| F-2-3 | Fixed | CSV test asserts every field on all three rows. |
| F-2-4 | Fixed | Privacy test covers attachment, save, outputs, backup/import, reset, and exit. |
| F-2-5 | Fixed | Free-core test checks successful outcomes. |
| F-2-6 | Fixed | Landing and registry use the full CSV preservation claim. |
| F-2-7 | Fixed | Exported categories are asserted. |
| F-2-8 | Fixed | Client print is billable-only; backup/import paths are tested. |
| F-2-9 | Fixed | Manifest/service-worker claim is listed and passes. |
| F-2-10 | **Reopened** | Broad privacy wording remains on Privacy; F-3-3. |
| F-2-11 | Fixed | Attachment omission is listed and tested. |
| F-2-12 | Fixed | Persistence and cent-state claims are listed and tested. |
| F-2-13 | **Reopened** | Demo misses the required 180×180 touch icon; F-3-1. |
| F-2-14 | Fixed | Wordmark, nav links, footer links, and build label match across routes. |
| F-2-15 | Fixed | Supplier bill, attachment, and client line list terminology is consistent. |
| F-2-16 | Fixed | The exact `clear`, `namespace`, and `IndexedDB` visitor-copy defects are gone. |
| F-2-17 | Fixed | Demo labels consistently describe sample-only records. |

## Structure, links, accessibility, and identity

- Root, demo, Privacy, Terms, and 404 use route-specific title patterns, one h1, `lang=en`, one main landmark, descriptions, canonical URLs, OG/Twitter data, favicon, and shared chrome except F-3-1.
- Root → Privacy and browser Back focus the destination h1. Direct demo/legal deep links work. The 404 exception is F-3-2.
- The sitemap lists all four real routes. Unknown URLs return a designed 404. Every crawled internal link and the GitHub Source URL returned 200; the deliberate unknown URL returned 404.
- No checked route overflowed at 390 px. Axe found no serious/critical issues. Manual target-size failures are F-3-9.
- Live headers include CSP, frame denial, nosniff, and strict-origin referrer policy. The service worker is `no-cache`; the unsafe stable CSS cache policy is F-3-4.
- The 1200×630 social image is present. Main JavaScript is 9.49 kB gzip. No third-party font/script request or console error occurred.
- The monochrome job-cost broadsheet, safety-orange rules, invoice collage, condensed type, and near-square controls are distinct from a generic SaaS template and match `.factory/design.md`.

## Missed leverage

F-3-15 is the one obvious missing extension. Sync would conflict with the local-first privacy thesis, and model-selected billable/overhead treatment would add bookkeeping risk. Optional extraction of factual bill fields would reduce transcription while leaving every consequential choice with the user.

## What would make this perfect

1. Close the four reopened history findings: correct `/demo` touch metadata, focus the 404 h1, narrow or fully test the real-data privacy promise, and stop immutable caching on stable CSS.
2. Rewrite or test every remaining Privacy/Terms claim, especially the false `at any time` sentence.
3. Make every 390 px interactive target 44×44 and add complete target-size coverage.
4. Replace the noun-only saved-list buttons and README jargon with the proposed plain wording.
5. Label the GitHub link as external.
6. Add reviewable, optional supplier-bill extraction through the Sociobot gateway, with manual/offline fallback and fixture-backed claims.
7. Rerun the full checklist against the deployment. PASS only with zero findings and no unlisted claim.
