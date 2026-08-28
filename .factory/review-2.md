# Adversarial first-read review 2 — Split Cost Slip

**Verdict: FAIL**

Reviewed 2026-08-28 at commit `7c568b5b9fad1d5ccc8c292231afb13592880c9b` against <https://split-pass-through-costs.sociobot.in>. Product code was not changed. `.factory/brief.json` is not present; the review used the deployed product, README, design record, claims registry, demo record, earlier verification, review 1, polish 1, and handoff.

The cold landing screen is clear and the isolated sample is real, but the first demo viewport does not show the sample being used. Four passing claim tests do not prove their full claim wording, several public promises remain unlisted, the client-print action includes overhead, and prior metadata, shared-shell, and terminology findings remain incomplete. A PASS requires zero findings and no untested claim.

## Thirty-second cold read

| View | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390×844, fresh context | Splits one supplier bill into billable costs and overhead. | Contractors separating client costs from their own overhead. | `Try it with sample data`; `The sample opens a completed supplier bill.` explains the result. | PASS |
| 1366×900, fresh context | Same answer. | Same answer. | The sample action is fully visible at y=712–760. | PASS |

Exact first-screen copy was `Split one bill into billable and overhead costs.`, `For contractors who need to separate client costs from their own overhead.`, `Try it with sample data`, and `The sample opens a completed supplier bill.` The three facts were also visible in both viewports. On desktop their bottom edge was y=891 in a 900 px viewport.

## Findings — blocking

### F-2-1 — The first demo viewport is another landing hero, not the product in use

- Location/quote: `/demo` at 390×844. The visible screen repeats `Split one bill into billable and overhead costs.`, `Try it with sample data`, and `Enter my bill` beneath the demo banner.
- Evidence: after one click from the root, the seeded workspace begins at y=1744. `Sunrise Building Supply` and `Balanced exactly` are populated but outside the 844 px viewport. The demo's own primary action links back to `/demo`.
- Impact: the visitor cannot see the product working after the promised one-click sample action. This fails the explicit demo requirement even though the data is seeded correctly.
- Fix: make `/demo` open with the seeded working slip at the top. Keep the banner visible and put supplier, total, rows, and balanced result in the first viewport; remove the duplicate sample CTA from demo mode.

### F-2-2 — The attachment claim test covers PDF only, not the claimed image and PDF support

- Location/quote: `.factory/claims.json` `attachment-boundary`: `Stores image and PDF attachments up to 10 MB in this browser.`
- Evidence: the only tagged test uploads `sunrise.pdf` and `too-big.pdf`. It never uploads or reloads an image.
- Impact: part of the listed claim remains untested despite the command passing.
- Fix: in the one `@claim:attachment-boundary` test, exercise a supported image and PDF, persistence after reload, and the exact 10,000,000/10,000,001-byte boundary.

### F-2-3 — The split-export test does not verify every promised field on every row

- Location/quote: `.factory/claims.json` says `Exports each balanced cost row with its billable or overhead choice.` The landing page adds `Each row keeps its source bill reference, category, and billable or overhead choice.`
- Evidence: the test checks four line breaks and searches the entire file for one supplier, one description, `Billable`, and `Overhead`. It does not parse each row or assert the reference, category, amount, or treatment for each corresponding sample row.
- Impact: duplicated, omitted, or mismatched row fields could pass. The broader landing sentence also has no matching registry entry.
- Fix: parse the CSV and assert the header plus all exact fields for each of the three seeded rows, including `SBS-48192`, category, amount, currency, and treatment. Align the registry wording with the retained landing sentence.

### F-2-4 — The “complete demo flow” privacy test exercises only load, save, and CSV export

- Location/quote: README and claim `local-privacy`: `The complete demo flow sends no cross-origin request.`
- Evidence: the tagged test records requests only while loading `/demo`, clicking `Save slip`, and exporting CSV. It does not exercise attachment, client copy, print, backup export/import, reset, or `Start for real`.
- Impact: the test cannot support the word `complete` or the broader absence claims elsewhere in the README.
- Fix: intercept the entire seeded workflow and exercise every network-capable action. Alternatively replace `complete demo flow` with the exact tested scope.

### F-2-5 — The free-core test checks enabled buttons instead of successful outcomes

- Location/quote: `.factory/claims.json`: `Saving and exports are available without a license.`
- Evidence: `@claim:free-core` only asserts that save, CSV, copy, and the absence of `Buy Pro` controls are present/enabled. It never saves, reloads, downloads, or reads copied output.
- Impact: this violates the claim rule that a test must prove the result rather than the existence of a button.
- Fix: save the sample, reload it, download and inspect CSV, and verify client-line output without a license or paywall.

### F-2-6 / F-1-8 (reopened) — The current output-preservation sentence remains broader than its test

- Location/quote: landing output section, `Each row keeps its source bill reference, category, and billable or overhead choice.`
- Evidence: no claims entry uses this wording, and the split-export test omits source-reference and category assertions.
- Impact: a visitor can rely on output fields that the registry does not prove.
- Fix: use the expanded parsed-CSV test described in F-2-3 and list the complete sentence as the claim.

### F-2-7 / F-1-20 (reopened) — User-selected category labels remain an unlisted, unproved claim

- Location/quote: README, `Billable and overhead cost rows with your own category labels`.
- Evidence: the CSV test does not assert `Materials` or `Delivery`, and no claim entry promises user-selected category labels.
- Impact: this earlier unlisted claim was retained without its requested evidence.
- Fix: add category editing and exact exported-category assertions to one claim test, then add the matching registry entry.

### F-2-8 / F-1-23 (reopened) — The combined output claim is still unlisted, and “Print client list” prints overhead

- Location/quote: README, `CSV, client line list, print, and JSON backup/import tools`; button, `Print client list`.
- Evidence: only CSV has a claim entry. Under print media, all three sample `.allocation-row` elements remain visible, including `Delivery to workshop` marked `Overhead`. Backup import/export and client-line output have no tagged claim tests.
- Impact: a contractor can expose an internal overhead row in output labelled for a client. The other advertised outputs remain unverified.
- Fix: render a dedicated billable-only client print view, or rename the action `Print full split`. Add separate result tests and registry entries for client lines, print, backup export, and atomic import.

### F-2-9 / F-1-24 (reopened) — Installability is still claimed without a claim entry or tagged test

- Location/quote: README, `An installable app that works offline after the first visit`.
- Evidence: `offline-reload` proves the second half only. No claims entry/test checks manifest parsing, required icons, start URL, display mode, or browser installability errors.
- Impact: one half of the sentence is untested.
- Fix: split the sentence. Add an `installable-app` claim and test the production manifest and Chromium installability result; retain the existing offline claim separately.

### F-2-10 / F-1-31 (reopened) — The broad absence claim exceeds the demo request test

- Location/quote: README, `There are no accounts, analytics, remote bill uploads, CDN fonts, or third-party runtime scripts.` Landing page: `There are no accounts, tracking scripts, or bill uploads.`
- Evidence: `local-privacy` observes requests during only three demo actions. It does not inspect every built HTML/script asset or exercise every feature, and it cannot establish the absence of an account system from that limited flow.
- Impact: the retained wording is materially broader than the listed claim and sandbox.
- Fix: narrow the copy to the tested network behavior, or add a build/source check plus a full-flow interception test and list the full claim.

### F-2-11 / F-1-33 (reopened) — Backup attachment omission is still a visitor-facing unlisted claim

- Location/quote: landing archive, `Backup files contain slip details, not attachments.` README, `JSON backups omit attachments, so keep original supplier files separately.`
- Evidence: no claims entry or tagged test exports a backup and asserts that attachment bytes and attachment blobs are absent.
- Impact: visitors may rely on a backup boundary that is documented but not continuously verified.
- Fix: add a `backup-omits-attachments` entry and test the downloaded JSON after attaching a known file.

### F-2-12 — Slip persistence and exact balance behavior are unlisted claims

- Location/quote: landing, `Saved in this browser`; README, `Slip details and attachments stay in browser IndexedDB`; README, `Exact cent totals with a clear balanced, under, or over state`.
- Evidence: none of the six registry entries promises general slip persistence or exact cent/under/over behavior. Unit and regression tests exist, but they are not claim-tagged or mapped in `claims.json`.
- Impact: `.factory/claims.json` is not a complete inventory, contrary to the README sentence `Every visitor-facing claim is listed in .factory/claims.json.`
- Fix: add separate `slip-persistence` and `cent-balance` entries with clean-demo save/reload and exact under/over/balanced tests. Remove `clear` from the balance copy.

### F-2-13 / F-1-44 (reopened) — Route metadata remains incomplete

- Location: live `/privacy/`, `/terms/`, and `/does-not-exist`; matching files in `public/`.
- Evidence: Privacy and Terms have no `twitter:title` or `twitter:description`. The live 404 has no meta description, canonical, Open Graph image/title/description, Twitter card/title/description, or apple-touch icon. The only apple-touch asset used elsewhere is 192×192 rather than the required 180 px asset.
- Impact: prior finding F-1-44 required complete metadata on every route and was marked fixed, but legal and error routes remain incomplete.
- Fix: add the full route-specific metadata set to Privacy, Terms, and the static 404, and ship/reference a 180×180 apple-touch icon.

### F-2-14 / F-1-45 (reopened) — The shared header/footer skeleton is still inconsistent

- Location: live route chrome.
- Evidence: root/demo headers expose `Demo` and `Saved slips`; legal/404 headers expose `Demo`, `Privacy`, and `Terms`. Root/demo footers add `Source`; legal/404 footers do not. At 390 px the root wordmark visually collapses to `S/`, while legal routes show `S/ Split Cost Slip`.
- Impact: the earlier common-shell finding was marked fixed, but navigation and product identity still change by route.
- Fix: use one shared wordmark, header navigation, and footer link set on every route. Keep app-only archive controls inside the app workspace rather than replacing global navigation.

### F-2-15 / F-1-60 (reopened) — Terms for the source record, attachment, and client output still change

- Location/quotes: `supplier bill`, `source bill`, `original bill total`, `optional source file`, `Attach the source bill`, `client line list`, `client lines`, and Privacy's `client text`.
- Evidence: `.factory/copy-audit.md` declares `supplier bill` and `client line list` as the standard terms, but the live and README copy use the alternatives above.
- Impact: the previous terminology finding was marked fixed although the same concepts still change names.
- Fix: use `supplier bill`, `attachment`, and `client line list` everywhere. Example: `Supplier bill total`, `Attach the supplier bill`, and `Copy client line list`.

## Findings — minor

### F-2-16 — Two copy units use avoidable adjective or implementation jargon

- Location/quote: landing heading, `Turn one supplier bill into a clear split.` README, `The demo uses a separate browser-storage namespace.` and `Slip details and attachments stay in browser IndexedDB.`
- Impact: `clear` is an unmeasured adjective; `namespace` and `IndexedDB` require implementation knowledge.
- Fix: use `Split one supplier bill in three steps.`, `The demo uses separate browser storage.`, and `Slip details and attachments stay in this browser.`

### F-2-17 — Demo storage labels contradict one another

- Location/quote: the first demo viewport shows `Demo — sample data, nothing is saved` beside `Saved slips 1`; the seeded workspace later says `Storage / Not saved yet` even though the sample is already in the demo database.
- Impact: a visitor cannot tell whether the sample is saved, temporary, or part of their real archive.
- Fix: keep the required banner, rename the demo archive count to `Sample slips 1`, and show `Sample record` rather than `Not saved yet` until the visitor explicitly changes or saves it.

## Demo and sandbox evidence

| Check | Result |
| --- | --- |
| One-click entry from root | PASS; `Try it with sample data` reaches `/demo` in one click |
| Immediate seeded values | PASS in DOM; Sunrise Building Supply, SBS-48192, $1,287.50, three realistic rows, `Balanced exactly` |
| Sample visible in first post-click viewport | **FAIL**; workspace starts at y=1744 on 390×844 |
| Banner | PASS; `Demo — sample data, nothing is saved`, namespace, reset, and real-start controls remain visible |
| Reset | PASS; changed supplier returned to Sunrise Building Supply |
| Real/demo isolation | PASS; real supplier survived demo/reset; databases were `split-cost-slip` and `split-cost-slip:demo` |
| Start for real | PASS; opened `/?new=1`, removed the demo database, and left real storage separate |
| `?demo=1` | PASS; seeded sample, banner, demo title, and `/demo` canonical |
| Cross-origin requests in exercised flow | PASS; none during live load/save/export/reset checks |
| Warm offline reload | PASS; sample remained and status became `Offline — ready to keep working` |

## Claims registry execution

All commands below ran independently from clean clone `/tmp/split-review2-clean.Hpejc8` at the reviewed commit. A passing command does not cure the coverage findings above.

| Claim | Exact command | Command result | Coverage result |
| --- | --- | --- | --- |
| `demo-isolation` | `npm run test:claims -- --grep @claim:demo-isolation` | PASS, desktop + mobile | PASS |
| `split-export` | `npm run test:claims -- --grep @claim:split-export` | PASS, desktop + mobile | **FAIL**, F-2-3/F-1-8 |
| `attachment-boundary` | `npm run test:claims -- --grep @claim:attachment-boundary` | PASS, desktop + mobile | **FAIL**, F-2-2 |
| `local-privacy` | `npm run test:claims -- --grep @claim:local-privacy` | PASS, desktop + mobile | **FAIL**, F-2-4/F-1-31 |
| `offline-reload` | `npm run test:claims -- --grep @claim:offline-reload` | PASS, desktop + mobile | PASS |
| `free-core` | `npm run test:claims -- --grep @claim:free-core` | PASS, desktop + mobile | **FAIL**, F-2-5 |

Additional gates: `npm test` passed 3 unit and 20 Playwright runs; `npm run build` passed and emitted `dist/` with 27.55 kB raw / 9.16 kB gzip JavaScript and 17.13 kB raw / 4.53 kB gzip CSS. Live axe found zero serious/critical WCAG 2 A/AA violations on root, demo, Privacy, Terms, and 404. The prior invalid-money, malformed-import, attachment-boundary, legal-contrast, footer-target, and response-policy regressions passed live checks.

## Copy audit

Counts treat a hyphenated term as one word and exclude standalone symbols. No sentence exceeds 22 words. `OK` means no length, banned-word, vague-heading, terminology, adjective, or action-label issue; claim coverage is cross-referenced separately.

### Landing page sentences, headings, and sentence-like units

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | `For contractors billing materials` | OK |
| 8 | `Split one bill into billable and overhead costs.` | OK |
| 12 | `For contractors who need to separate client costs from their own overhead.` | OK |
| 7 | `The sample opens a completed supplier bill.` | OK |
| 5 | `Your real bill starts empty.` | OK |
| 4 | `Saved in this browser` | Unlisted claim, F-2-12 |
| 6 | `Works offline after the first visit` | Listed claim |
| 3 | `Free to use` | Listed claim; test gap F-2-5 |
| 3 | `One source bill.` | Terminology, F-1-60 |
| 4 | `Billable costs and overhead.` | OK |
| 3 | `How it works` | OK |
| 8 | `Turn one supplier bill into a clear split.` | Adjective, F-2-16 |
| 3 | `Enter the bill.` | OK |
| 8 | `Add the supplier total and optional source file.` | Terminology, F-1-60 |
| 3 | `Divide each cost.` | OK |
| 7 | `Mark every cost row billable or overhead.` | OK |
| 3 | `Export the split.` | OK |
| 11 | `Save a CSV or a client line list when it balances.` | Unlisted client-line claim, F-1-23 |
| 4 | `No saved slips yet.` | OK |
| 7 | `Your first balanced bill will appear here.` | OK |
| 7 | `Backup files contain slip details, not attachments.` | Unlisted claim, F-1-33 |
| 4 | `Enter the supplier bill.` | OK |
| 4 | `Required fields are marked *.` | OK |
| 4 | `Use two decimal places.` | OK |
| 9 | `Include tax if it is on the source bill.` | Terminology, F-1-60 |
| 4 | `Attach the source bill` | Terminology, F-1-60 |
| 12 | `Images and PDFs up to 10 MB are saved in this browser.` | Listed claim; test gap F-2-2 |
| 3 | `No attachment yet` | OK |
| 6 | `Divide the bill into cost rows.` | OK |
| 11 | `Billable means you plan to charge the client for that row.` | OK |
| 7 | `Match the split to the bill total.` | OK |
| 11 | `Enter the bill total and cost rows to check the split.` | OK |
| 4 | `Export the finished split.` | OK |
| 13 | `Each row keeps its source bill reference, category, and billable or overhead choice.` | Unlisted/broader claim, F-1-8 |
| 8 | `Check your bookkeeping and tax treatment before importing.` | OK |
| 10 | `Split Cost Slip does not give tax or accounting advice.` | OK |
| 3 | `Privacy and limits` | OK |
| 3 | `It splits bills.` | OK |
| 6 | `It does not replace accounting software.` | OK |
| 9 | `There are no accounts, tracking scripts, or bill uploads.` | Broader claim, F-1-31 |
| 12 | `Keep original supplier files and check every export before accounting or invoicing.` | OK |
| 11 | `Split Cost Slip separates one bill into billable costs and overhead.` | OK |
| 6 | `Built by Param Factory · build polish-1` | OK |

### Landing and demo controls

| Words | Exact control | Result |
| ---: | --- | --- |
| 1 | `Demo` | OK as destination link |
| 2 | `Saved slips` | OK as disclosure |
| 5 | `Try it with sample data` | OK |
| 3 | `Enter my bill` | OK |
| 4 | `Create a new slip` | OK |
| 2 | `Export backup` | OK |
| 2 | `Import backup` | OK |
| 2 | `Attach bill` | OK |
| 2 | `Open attachment` | OK |
| 3 | `Add cost row` | OK |
| 3 | `Remove cost row` | OK |
| 2 | `Save slip` | OK |
| 2 | `Export CSV` | OK |
| 3 | `Copy client lines` | Terminology, F-1-60 |
| 3 | `Print client list` | Result mismatch, F-1-23 |
| 2 | `Delete slip` | OK |
| 2 | `Reset demo` | OK |
| 3 | `Start for real` | OK; required demo exit wording |

Demo-only status units: `Demo — sample data, nothing is saved` (6 words), `Saved slips 1` (3), and `Not saved yet` (3) conflict as described in F-2-17. `Using demo:split-cost-slip only.` is implementation jargon covered by F-2-16.

### README sentences, headings, and copy units

| Words | Exact copy | Result |
| ---: | --- | --- |
| 3 | `Split Cost Slip` | OK |
| 14 | `Split Cost Slip helps contractors separate one supplier bill into billable costs and overhead.` | OK |
| 7 | `Attach the bill and enter each cost.` | OK |
| 6 | `Mark each row billable or overhead.` | OK |
| 7 | `Export a CSV or client line list.` | Unlisted client-line claim, F-1-23 |
| 3 | `Try the sample` | OK |
| 3 | `What it includes` | OK |
| 11 | `Exact cent totals with a clear balanced, under, or over state` | Unlisted claim/adjective, F-2-12/F-2-16 |
| 10 | `Billable and overhead cost rows with your own category labels` | Unlisted claim, F-1-20 |
| 11 | `Images and PDFs up to 10 MB, stored in this browser` | Listed claim; test gap F-2-2 |
| 9 | `CSV, client line list, print, and JSON backup/import tools` | Unlisted claims, F-1-23 |
| 11 | `A separate sample demo that never reads or writes real slips` | Listed claim |
| 10 | `An installable app that works offline after the first visit` | Partly unlisted, F-1-24 |
| 3 | `It splits bills.` | OK |
| 10 | `It does not replace accounting software or provide tax advice.` | OK |
| 1 | `Develop` | OK in developer documentation |
| 5 | `Requires Node.js 20 or newer.` | OK in developer documentation |
| 5 | `Vite prints the local URL.` | OK in developer documentation |
| 8 | `Real records use browser storage for that origin.` | Unlisted persistence claim, F-2-12 |
| 7 | `The demo uses a separate browser-storage namespace.` | Jargon, F-2-16 |
| 3 | `Test and build` | OK |
| 4 | `Playwright 1.58.2 is pinned.` | OK; verified |
| 10 | `If Chromium is missing, run npx playwright install chromium once.` | OK |
| 10 | `npm test runs money, desktop, mobile, accessibility, and offline-reload tests.` | OK; verified |
| 12 | `The production build is npm run build; deploy the generated dist/ directory.` | OK; verified |
| 7 | `Every visitor-facing claim is listed in .factory/claims.json.` | False, F-2-6 through F-2-12 |
| 8 | `Run any listed command from a fresh checkout.` | OK; verified |
| 10 | `The sample route and reset behavior are documented in .factory/demo.md.` | OK; verified |
| 3 | `Privacy and storage` | OK |
| 8 | `Slip details and attachments stay in browser IndexedDB.` | Jargon/unlisted claim, F-2-12/F-2-16 |
| 8 | `The complete demo flow sends no cross-origin request.` | Listed claim; test gap F-2-4 |
| 14 | `There are no accounts, analytics, remote bill uploads, CDN fonts, or third-party runtime scripts.` | Broader claim, F-1-31 |
| 10 | `JSON backups omit attachments, so keep original supplier files separately.` | Unlisted claim, F-1-33 |
| 2 | `Project notes` | OK |
| 6 | `Visual rationale and image provenance: .factory/design.md` | OK |
| 3 | `Delivery evidence: .factory/handoff.md` | OK |
| 2 | `License: MIT` | OK |

## Earlier finding verification

Every review-1 finding was rechecked on the live site and in the current code. `Fixed` means the exact earlier defect is no longer present; reopened items are blocking above.

| Earlier id | Status | Current evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Both cold viewports answer job, audience, and first action. |
| F-1-2 | Fixed | Demo is seeded and isolated; first-viewport weakness is new F-2-1. |
| F-1-3 | Fixed | Registry and six unique tagged tests exist. Coverage gaps are F-2-2 through F-2-12. |
| F-1-4 | Fixed | Old broad strip copy was removed; current storage wording is covered by F-2-12. |
| F-1-5 | Fixed | Invalid money blocks balance/save/export live. |
| F-1-6 | Fixed | Attachment-first persistence works live. |
| F-1-7 | Fixed | Exact PDF size boundary works live. |
| F-1-8 | **Reopened** | Current source/reference/category sentence exceeds test coverage. |
| F-1-9 | Fixed | Five-slip limit copy and cap were removed. |
| F-1-10 | Fixed | Dead $19 offer was removed. |
| F-1-11 | Fixed | Pro archive claim was removed. |
| F-1-12 | Fixed | `free-core` replaced the broad `always` claim; test weakness is F-2-5. |
| F-1-13 | Fixed | Footer provenance marketing claim was removed. |
| F-1-14 | Fixed | Optional-license wording was removed. |
| F-1-15 | Fixed | Checkout wording and link were removed. |
| F-1-16 | Fixed | Merchant/refund statement was removed. |
| F-1-17 | Fixed | README opener is short and contractor-specific. |
| F-1-18 | Fixed | Core split/export, invalid input, and attachment persistence work. |
| F-1-19 | Fixed | Invalid decimals announce an error and block output. |
| F-1-20 | **Reopened** | Category-label claim remains without a mapped assertion. |
| F-1-21 | Fixed | Image/PDF implementation and PDF boundary persist; image test gap is F-2-2. |
| F-1-22 | Fixed | Capped/Pro archive claims were removed. |
| F-1-23 | **Reopened** | Combined output claim is unlisted and client print includes overhead. |
| F-1-24 | **Reopened** | Offline passes; installability remains unlisted and untested. |
| F-1-25 | Fixed | Paid-license claim was removed. |
| F-1-26 | Fixed | Privacy and Terms return 200 and pass axe. |
| F-1-27 | Fixed | Real/demo storage separation passed live. |
| F-1-28 | Fixed | README test scope matches the passing suite. |
| F-1-29 | Fixed | Build command passed and emitted `dist/index.html`. |
| F-1-30 | Fixed | Slip/attachment association survives reload. |
| F-1-31 | **Reopened** | Broad absence claim remains broader than the interception test. |
| F-1-32 | Fixed | License request claim and code were removed. |
| F-1-33 | **Reopened** | Backup-omission copy remains without a claim test. |
| F-1-34 | Fixed | Live invalid-money regression passed. |
| F-1-35 | Fixed | Live malformed import was rejected and reload stayed usable. |
| F-1-36 | Fixed | Purchase UI/calls are absent. |
| F-1-37 | Fixed | Attachment-only association persists. |
| F-1-38 | Fixed | Legal routes have zero serious/critical axe findings. |
| F-1-39 | Fixed | CSP, anti-framing, nosniff, and referrer headers are live. |
| F-1-40 | Fixed | Hashed assets are immutable; `sw.js` is `no-cache`. |
| F-1-41 | Fixed | Every checked mobile footer link measured 44×44 px. |
| F-1-42 | Fixed | Accessible wordmark name contains the visible label. |
| F-1-43 | Fixed | Unknown route returns a designed HTTP 404 with home/demo paths. |
| F-1-44 | **Reopened** | Legal Twitter metadata and most 404 metadata remain absent. |
| F-1-45 | **Reopened** | Header/footer navigation still changes by route. |
| F-1-46 | Fixed | Root → Privacy and browser Back both focused the destination h1. |
| F-1-47 | Fixed | Facts, three steps, and limits section are present in order. |
| F-1-48 | Fixed | h1 states the job in eight words. |
| F-1-49 | Fixed | Audience eyebrow is plain and specific. |
| F-1-50 | Fixed | Source heading names the supplier bill. |
| F-1-51 | Fixed | Row heading names cost rows. |
| F-1-52 | Fixed | Totals heading names the matching task. |
| F-1-53 | Fixed | Output heading names export. |
| F-1-54 | Fixed | Paid-section heading was removed. |
| F-1-55 | Fixed | Primary action is `Try it with sample data`. |
| F-1-56 | Fixed | New action is `Create a new slip`. |
| F-1-57 | Fixed | Paid-details action was removed. |
| F-1-58 | Fixed | License-restore action was removed. |
| F-1-59 | Fixed | Unsupported secure-buy action was removed. |
| F-1-60 | **Reopened** | Supplier/source/original bill and client output terms still vary. |
| F-1-61 | Fixed | README opener is 14 words. |
| F-1-62 | Fixed | README workflow is split into 7/6/7-word sentences. |
| F-1-63 | Fixed | README test sentence is 10 words. |
| F-1-64 | Fixed | README introduction no longer leads with implementation/accounting jargon. |

## Structure, links, accessibility, and identity

- Titles pass the required pattern and length on root, demo, Privacy, Terms, and 404.
- Root and demo have complete canonical/OG/Twitter metadata and one h1/main. Legal/404 exceptions are F-1-44.
- The sitemap lists root, demo, Privacy, and Terms. Unknown paths return the designed 404.
- Root → Privacy and browser Back restore h1 focus. Direct deep links load their intended content.
- All crawled internal links and the GitHub Source link returned 200; the deliberate unknown route returned 404.
- Live axe found zero serious/critical violations on all five checked routes. Mobile footer targets were 44×44 px and no checked page overflowed horizontally.
- The monochrome broadsheet, safety-orange rule, generated invoice collage, condensed typography, and near-square controls remain product-specific rather than a generic SaaS template.
- Response headers include CSP, `DENY`, `nosniff`, and strict-origin referrer policy. Hashed assets use one-year immutable caching and the service worker uses `no-cache`.

## Missed leverage

No additional AI feature is justified by the available product record. Billable/overhead treatment depends on client agreements and bookkeeping judgment, so model classification would add risk rather than complete the core job. CSV, client-line, print, and JSON import/export paths already exist; the required work is to make and test those paths accurately, not add sync or decorative AI. No provider keys or AI calls are present.

## What would make this perfect

1. Make the seeded workspace, sample supplier, rows, and balanced result the first `/demo` viewport.
2. Strengthen all four under-scoped claim tests and add entries/tests for persistence, cent balance, installability, categories, client output, print, and backup behavior.
3. Make `Print client list` billable-only and verify it with sample output.
4. Complete legal/404 metadata and use identical global navigation/footer chrome on every route.
5. Standardize `supplier bill`, `attachment`, and `client line list`; remove `clear`, `namespace`, and `IndexedDB` from visitor copy.
6. Make demo archive/storage labels consistently describe sample-only state.
7. Rerun the full checklist against the deployed repair. PASS only when the review has zero findings and every retained claim has complete sandbox proof.
