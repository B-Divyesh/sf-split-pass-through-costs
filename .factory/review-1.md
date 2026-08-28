# Adversarial first-read review 1 — Split Cost Slip

**Verdict: FAIL**

Reviewed 2026-08-28 at commit `cc621feee496c7aa11ffc9e5696ef8cfdc81e25d` against <https://split-pass-through-costs.sociobot.in>. The live root matched the candidate already established by the prior verification. The repository was clean before review. Product code was not changed.

This release has blocking first-screen, demo, claims, data-integrity, purchase, accessibility, security, and routing findings. A PASS requires zero findings and no untested claim.

## Thirty-second cold read

| View | What does it do? | For whom? | What should I click first? |
| --- | --- | --- | --- |
| 390×844, fresh context | It appears to divide one supplier bill into client-billable and overhead rows. | **Cannot answer from the first screen.** No audience is named. | `Start this split` is visible, but it opens an empty form rather than a sample. |
| 1366×900, fresh context | The deck gives the same basic split. | **Cannot answer from the first screen.** | **Cannot answer without scrolling.** The primary button occupies y=884–932 and is not fully inside the 900 px viewport; `Saved slips 0` and `Unlock Pro` are the visible actions. |

Exact text that failed the cold read:

- Headline: `One bill in. Clean costs out.`
- Supporting line: `Split a mixed supplier bill into client-reimbursable and overhead rows—without duplicating the original expense.`
- Eyebrow: `Field ledger № 01 / local utility`
- Primary action: `Start this split`

The supporting line says what is split, but none of these strings says “for contractors” or names a contractor situation. The desktop composition also pushes the action below the first screen.

## Findings — blocking

### F-1-1 — The first screen does not answer all three cold-read questions

- Location/quote: root hero; the four strings quoted above.
- Evidence: no audience term appears in the 390×844 or 1366×900 first viewport. At desktop, the primary button is not fully visible.
- Impact: a first-time visitor cannot tell whether the tool is for a contractor, client, bookkeeper, or supplier, and the desktop visitor has no clear first action.
- Fix: use `Split one bill into billable and overhead costs` as the h1. Follow with `For contractors who need to separate client costs from their own overhead.` Put `Try it with sample data` and `Enter my bill` above the fold, with a short description of what each does.

### F-1-2 — There is no demo, and the nominal demo URL exposes real storage

- Location: root, `/demo`, `/?demo=1`, README, and missing `.factory/demo.md`.
- Evidence: there is no `Try it with sample data` action. `/demo` and `/?demo=1` both load an empty normal workspace. Neither has sample data, `Demo — sample data, nothing is saved`, `Reset demo`, or `Start for real`. After saving `REAL PRIVATE SUPPLIER` on `/`, opening `/demo` in the same context displayed that real slip (`supplier=REAL PRIVATE SUPPLIER`, saved count `1`).
- Impact: the product is not tryable in one click, and a URL that looks like a demo reads and writes the real IndexedDB namespace.
- Fix: implement `/demo` as an isolated `demo:` namespace seeded with a realistic mixed supplier bill and balanced rows. Show the required persistent banner and controls, discard demo data on exit, document the route and namespace in `.factory/demo.md`, and link it from the first screen and README.

### F-1-3 — The required claims registry and claim-tagged tests do not exist

- Location: missing `.factory/claims.json`; repository-wide search found no `@claim:` tags.
- Evidence: there were no listed claim commands to run. `npm test` passes 3 unit and 12 browser tests, but none is mapped to a public claim.
- Impact: no visitor-facing promise has the required clean-sandbox proof. This leaves every claim below untested under the product contract even where an ad hoc review check passed.
- Fix: add `.factory/claims.json`. Give every retained claim exactly one `@claim:<id>` test that starts through `/demo` in fresh storage. Remove claims that cannot be tested.

### Unlisted claim findings

Each row is a separate unlisted-claim finding. “Manual result” is review evidence only; it does not replace the required registry entry and tagged test.

| ID | Exact claim and location | Manual result | Concrete fix |
| --- | --- | --- | --- |
| F-1-4 | Root strip: `Your work stays on this device.` | Ordinary flow made no cross-origin request, but `/demo` reads the real IndexedDB data. | Add a demo-isolation/storage claim test or remove the sentence until isolation exists. |
| F-1-5 | Root deck: `Split a mixed supplier bill into client-reimbursable and overhead rows—without duplicating the original expense.` | Basic split passes; invalid money can export a stale allocation. | Test a valid split and invalid-input blocking, then narrow the copy to the tested behavior. |
| F-1-6 | Root attachment copy: `Photo or PDF, stored only in this browser.` | A file attached before slip data is lost from the slip after reload. | Test attachment persistence from every allowed starting state before retaining the claim. |
| F-1-7 | Root attachment copy: `Maximum 10 MB.` | Prior verification confirmed the exact boundary, but no claim entry exists. | Add a 10,000,000/10,000,001-byte boundary test and claim entry. |
| F-1-8 | Root output copy: `Exports preserve one source reference and your selected treatment for every row.` | Valid export works; stale invalid money is still exported. | Assert the CSV fields and block export on invalid input. |
| F-1-9 | Root paid copy: `Five slips are free.` | Prior verification reached the five-slip cap. | Add a clean-demo limit test. |
| F-1-10 | Root paid copy: `Keep every job for $19 once.` | Checkout returns HTTP 404. | Remove until purchase works, then test checkout and a returned license. |
| F-1-11 | Root paid copy: `Pro unlocks unlimited on-device history and one-click slip duplication.` | License behavior is only tested with a mocked API; purchase is unavailable. | Add a claim test using an approved sandbox license, or remove the production claim. |
| F-1-12 | Root paid copy: `The split, attachment, CSV, client list, and backups always remain free.` | Core controls are visible without Pro; “always” is broader than the tests. | Replace with `These tools are included in the free edition` and test each listed output. |
| F-1-13 | Root footer: `Original hero artwork generated with the factory image model; no stock imagery.` | Provenance is documented, but this has no registry entry and “no stock imagery” is not sandbox-tested. | Remove the untestable clause or define a repository-asset provenance check. |
| F-1-14 | Root footer: `Nothing leaves your device except an optional license check.` | Fresh ordinary use made zero cross-origin requests. No demo exists, so the required demo flow cannot be checked. | Add a full-demo request interception test allowing only the documented license endpoint. |
| F-1-15 | Root dialog: `Checkout is hosted by Sociobot.` | The Sociobot URL responds 404 rather than hosting checkout. | Remove the claim until the endpoint returns a working checkout; then add an endpoint/navigation test. |
| F-1-16 | Root dialog: `Sociobot/Dodo is the merchant of record and handles refunds; a refund revokes the license.` | The checkout is unavailable, so this cannot be verified from the product sandbox. | Test the billing contract in the approved sandbox or remove the sentence. |
| F-1-17 | README: `Split Cost Slip is a local-first PWA for time-and-materials contractors who receive one supplier bill containing both their own overhead and client-reimbursable costs.` | Local persistence and PWA shell partly pass; demo isolation does not. | Split the sentence and map local storage/offline behavior to tests. |
| F-1-18 | README: `Attach the source bill, divide its exact total into named rows, mark each row billable or overhead, and take a clean CSV or client-ready line list into the accounting tool you already use.` | Normal flow passes; attachment and invalid-money edge cases fail. | Test the complete flow, including invalid input and empty-slip attachment persistence. |
| F-1-19 | README bullet: `Integer-cent calculations with an explicit balanced / under / over state` | Arithmetic unit tests pass; the UI can report a stale balanced state for invalid text. | Add a browser claim test that invalid text cannot retain “Balanced exactly.” |
| F-1-20 | README bullet: `Billable and overhead rows with user-selected category labels` | Present in the UI. | Add a demo-based observable row/treatment/category test. |
| F-1-21 | README bullet: `Local attachment retention for images and PDFs up to 10 MB` | Fails when attachment is the first input. | Fix persistence, then test image/PDF retention and both size boundaries. |
| F-1-22 | README bullet: `IndexedDB persistence, five-slip free archive, and unlimited Pro archive` | Free persistence/cap work; Pro cannot be bought. | Split into separately tested persistence, limit, and paid-license claims. |
| F-1-23 | README bullet: `CSV, client line list, print view, and JSON backup/import` | Basic paths exist; malformed import can poison startup. | Add output-content and strict import-schema tests. |
| F-1-24 | README bullet: `Installable manifest, responsive 390px layout, and offline app shell` | Manifest/offline reload pass; the mobile footer targets fail the 44 px requirement. | Split into three claims with installability, 390 px layout/target, and offline reload tests. |
| F-1-25 | README bullet: `One-time $19 Pro license via the hosted Sociobot checkout; no embedded payment provider` | Checkout returns HTTP 404. | Remove until a production/sandbox checkout test passes. |
| F-1-26 | README bullet: `Standalone /privacy/ and /terms/ pages` | Both routes return 200, but each has a serious contrast violation and incomplete site chrome. | Test HTTP status, metadata, common chrome, and axe results. |
| F-1-27 | README: `Browser data is stored only for that local origin.` | Normal local build behavior is plausible; `/demo` shares the same real origin storage. | Clarify storage namespaces and test the demo/real separation. |
| F-1-28 | README: ``npm test` runs deterministic money unit tests and Chromium browser tests on desktop and a Pixel 5 profile, including axe accessibility and offline reload checks.` | The command passes, but its axe check excludes legal pages and misses known failures. | Rewrite to list the actual scope or expand the suite to all routes. |
| F-1-29 | README: `The exact production build command is npm run build; deploy the generated dist/ directory, whose root contains index.html.` | `npm run build` passes and emits `dist/index.html`. | Add a lightweight build-output claim test or keep this as verified setup documentation outside marketing claims. |
| F-1-30 | README: `Slips and attachments live in browser IndexedDB.` | True for entered slips/files, but the file/slip relationship can be orphaned. | Test storage and referential integrity together. |
| F-1-31 | README: `There is no analytics, account, ad technology, remote bill upload, CDN font, or third-party runtime script.` | No cross-origin request occurred in the ordinary flow. | Add a request interception claim test for the entire seeded demo. |
| F-1-32 | README: `The only optional external request is daily license verification for Pro.` | Code can make the documented verification call; no demo claim test exists. | Intercept a licensed demo for more than one load and assert endpoint and daily caching. |
| F-1-33 | README: `JSON backups omit attachments, so retain original supplier files separately.` | Prior verification confirmed omission. | Add a backup-content claim test asserting that no attachment bytes are present. |

### Regressed or unfixed history findings

The repository contains no earlier `.factory/review-*.md` or `.factory/polish-*.md`. The prior `.factory/verification.md` and `.factory/handoff.md` were read in full. All nine recorded defects remain unfixed; the work order requires each to be blocking again.

#### F-1-34 — Prior `verification.md High-1`: invalid money exports stale data

- Reproduction: enter total `10.00`, row `10.00`, then replace the row with `10.999`.
- Live result: the field has `aria-invalid=true`, while the UI says `Balanced exactly`, split total remains `$10.00`, and CSV contains `10.00`.
- Code confirmation: `src/main.ts:358-363` keeps the previous cents when parsing returns `null`, then calls `changed()` and permits save/export.
- Fix: show and announce a concrete validation error, clear or separately invalidate the model value, and block save/export until all money fields parse. Add a regression claim test.

#### F-1-35 — Prior `verification.md High-2`: malformed import poisons startup

- Reproduction: import `{"format":"split-cost-slip","version":1,"slips":[{"id":"poison","totalCents":100,"allocations":[]}]}` and reload.
- Live result: the import surfaces `Currency code is required with currency style.`; reload raises the same page error and leaves `Checking connection…` stuck.
- Code confirmation: `src/db.ts:77-89` validates only `id`, `allocations`, and `totalCents`, then casts the object to `Slip`.
- Fix: schema-validate every field and nested allocation before writing anything; make import atomic; add recovery for invalid existing records and a regression test.

#### F-1-36 — Prior `verification.md High-3`: the advertised checkout is dead

- Location/quote: `Buy Pro securely`, `Keep every job for $19 once.`
- Live result: GET `https://api.sociobot.in/api/v1/products/split-pass-through-costs/checkout` returns HTTP 404 with `{"error":"enabled factory product","status":404}`.
- Code confirmation: `src/license.ts` still points directly at that endpoint.
- Fix: register/enable the product and test the live purchase return, or remove/disable all purchase calls and price claims until available.

#### F-1-37 — Prior `verification.md Medium-1`: first-input attachment is orphaned

- Reproduction: on a fresh page attach `bill.pdf` before entering any slip data, wait for the local success message, then reload.
- Live result: `bill.pdf · 1 KB` becomes `No attachment yet`.
- Code confirmation: `src/main.ts:383-391` writes the blob, but `saveCurrent()` returns at lines 302-305 for an otherwise empty slip.
- Fix: persist the slip record with its attachment atomically, or require minimum slip data before accepting the file. Test reload from this exact sequence.

#### F-1-38 — Prior `verification.md Medium-2`: legal-page contrast still fails

- Location: `.eyebrow` on `/privacy/` and `/terms/` at 390 px and desktop.
- Live result: axe reports one serious `color-contrast` violation on each page; prior measured ratio is 4.47:1.
- Code confirmation: `public/legal.css` still uses 11 px `#c63d18` on `#f2efe6`.
- Fix: use `#8e270d`, increase size/weight enough to pass, or otherwise reach at least 4.5:1. Include every route in axe tests.

#### F-1-39 — Prior `verification.md Low-1`: response security policy is incomplete

- Live result: root, assets, legal pages, and unknown paths have no CSP and no `X-Frame-Options`/`frame-ancestors`. The checked-in `_headers` is served rather than applied.
- Impact: the deployed product does not meet the stated security-header contract.
- Fix: configure the actual host to emit a CSP matching the app and an anti-framing policy; add a deployed-header test.

#### F-1-40 — Prior `verification.md Low-2`: production cache policy ignores the repository rules

- Live result: `/`, `/assets/app.js`, `/assets/app.css`, and `/sw.js` all return `Cache-Control: public, must-revalidate, max-age=30`.
- Impact: immutable assets are not long cached and the service worker does not receive its intended `no-cache` policy.
- Fix: apply the checked-in cache rules at the deployed host and verify headers in release checks.

#### F-1-41 — Prior `verification.md Low-3`: mobile footer links miss the 44 px target

- Live result at 390 px: Privacy is 42.63×15, Terms 35.39×15, and Source 41.20×15 CSS px.
- Fix: give each link a minimum 44×44 px clickable box with adequate spacing.

#### F-1-42 — Prior `verification.md Low-4`: home wordmark accessible name omits visible text

- Location: visible `S/ Split Cost Slip`; `aria-label="Split Cost Slip home"`.
- Impact: label-in-name voice control checks fail because visible `S/` is absent from the accessible name.
- Fix: remove the override or use an accessible name containing the complete visible label, such as `S/ Split Cost Slip — home`.

### F-1-43 — Unknown routes silently render the home app instead of a designed 404

- Location: `/does-not-exist` returns HTTP 200, home title, home h1, and an empty workspace.
- Impact: broken links look valid and visitors receive no explanation or way back from a distinct error state. This is broken routing and therefore blocking.
- Fix: add a product-styled `/404` page and hosting behavior that returns it with 404 status for unknown paths; include a clear home link and crawl test.

## Findings — major

### F-1-44 — Route metadata is incomplete and `/demo` has the wrong identity

- Root title is `Split Cost Slip — balanced pass-through costs`; “pass-through costs” is accounting jargon, not a plain description of the job.
- Root has no Open Graph or Twitter metadata and no 1200×630 product image.
- `/privacy/` and `/terms/` have no canonical, Open Graph, Twitter, or apple-touch metadata.
- `/demo` has the root title/canonical and no demo metadata.
- Fix: use `Split Cost Slip — split billable and overhead costs` and route-specific metadata such as `Demo — Split Cost Slip`; add canonical, OG, Twitter, SVG favicon, 180 px apple-touch icon, and original 1200×630 art on every route.

### F-1-45 — The route skeleton is inconsistent and route inventory is incomplete

- Root header has archive/Pro controls; legal headers have only wordmark/section text. Legal pages have no skip link or Privacy/Terms navigation.
- Root and legal footers omit `Built by Param Factory` and version/build id; their one-liners differ.
- No header links to Demo. `sitemap.xml` lists only `/`, `/privacy/`, and `/terms/`. `staticwebapp.config.json` is absent.
- Fix: use one common header/footer shell on all routes; add Demo, Privacy, Terms, factory attribution and build id; add all real routes to the sitemap and host routing configuration.

### F-1-46 — Route changes do not move focus or announce the new page

- Evidence: after root → Privacy and after browser Back, `document.activeElement` is `BODY`; there is no route announcement region on legal pages.
- Impact: keyboard and screen-reader users are not placed at the new h1 and may not know navigation occurred.
- Fix: focus the destination h1 on navigation/back-forward and announce its text in an `aria-live="polite"` region. Test forward, back, and deep-link entry.

### F-1-47 — The required landing-page information order is incomplete

- The first screen has no three short privacy/offline/price facts.
- There is no `How it works` section with three verb-led steps.
- The limitations are scattered in form fine print rather than a clear “What it does not do” section.
- Fix: add the required facts beside the actions, a three-step section using the real UI, and a plain limitations/privacy section before pricing.

## Findings — copy

### F-1-48 — The h1 is a slogan rather than the job

- Quote: `One bill in. Clean costs out.`
- Problem: “clean” is a vague marketing adjective; the heading does not name billable versus overhead costs.
- Rewrite: `Split one bill into billable and overhead costs`.

### F-1-49 — The hero eyebrow is internal jargon

- Quote: `Field ledger № 01 / local utility`.
- Problem: it does not make sense out of context and adds no user instruction.
- Rewrite: `For contractors billing materials and expenses` or remove it.

### F-1-50 — `Name the original` is an unclear heading

- Problem: a headings list does not reveal that this section asks for supplier bill details.
- Rewrite: `Enter the supplier bill`.

### F-1-51 — `Mark every cost` is an unclear heading

- Problem: it does not say the visitor must split the bill into rows and choose billable or overhead.
- Rewrite: `Divide the bill into cost rows`.

### F-1-52 — `Close the ledger` is jargon

- Problem: it hides the actual check being performed.
- Rewrite: `Match the split to the bill total`.

### F-1-53 — `Take it to invoicing` does not name the output

- Problem: the section also supports CSV, copy, print, and backup-related work; the heading is vague.
- Rewrite: `Export the finished split`.

### F-1-54 — `The long-job edition` is an out-of-context heading

- Problem: it does not identify Pro or the paid archive.
- Rewrite: `Keep more than five slips with Pro`.

### F-1-55 — `Start this split` does not name the immediate result

- Problem: it only scrolls and focuses an empty supplier field.
- Rewrite: use `Try it with sample data` for the primary action and `Enter my bill` for real use.

### F-1-56 — `New split slip` is not a verb-led result

- Rewrite: `Create a new slip`.

### F-1-57 — `See the one-time unlock` does not name the destination

- Rewrite: `View Pro details`.

### F-1-58 — `Verify and restore` omits the object

- Rewrite: `Restore Pro license`.

### F-1-59 — `Buy Pro securely` makes an unsupported adjective claim

- Evidence: the destination is currently a 404.
- Rewrite: `Buy Pro` after checkout works; until then, remove the action.

### F-1-60 — The same concepts use inconsistent terms

- Quotes: `client-reimbursable`, `Billable`, `Pass through`, `treatment`, `allocation`, `cost row`; `archive` versus `history`; `split slip` versus `slip`.
- Impact: visitors must infer which words mean the same thing.
- Fix: standardize on `billable` / `overhead`, `cost row`, `slip`, and `saved slips`. Define “billable” once; remove “pass-through,” “treatment,” “allocation,” and “history” from visitor copy where those concepts are identical.

### F-1-61 — README opening sentence exceeds 22 words

- Quote (23 words): `Split Cost Slip is a local-first PWA for time-and-materials contractors who receive one supplier bill containing both their own overhead and client-reimbursable costs.`
- Rewrite: `Split Cost Slip helps contractors separate one supplier bill into billable costs and overhead.`

### F-1-62 — README instruction sentence exceeds 22 words

- Quote (33 words): `Attach the source bill, divide its exact total into named rows, mark each row billable or overhead, and take a clean CSV or client-ready line list into the accounting tool you already use.`
- Rewrite: `Attach the bill and enter each cost. Mark each row billable or overhead. Export a CSV or client line list.`

### F-1-63 — README test sentence exceeds 22 words

- Quote (25 words): ``npm test` runs deterministic money unit tests and Chromium browser tests on desktop and a Pixel 5 profile, including axe accessibility and offline reload checks.`
- Rewrite: ``npm test` runs money, desktop, mobile, accessibility, and offline-reload tests.`

### F-1-64 — README leads with implementation and accounting jargon

- Quotes: `local-first PWA`, `Integer-cent calculations`, `IndexedDB persistence`, `offline app shell`, and `focused reconciliation companion`.
- Impact: the first product description requires web and accounting vocabulary before explaining the task.
- Rewrites: use `stores bills on this device and works offline`, `exact cent totals`, `saved in this browser`, `works offline after the first visit`, and `It does not replace accounting software.` Keep `IndexedDB` only in the developer/privacy implementation section.

## Copy audit

Word counts treat a hyphenated term as one word and exclude standalone symbols. `OK` means no length, jargon, inconsistent-term, vague-heading, marketing-adjective, or action-label flag was found in that unit. Claims can still fail separately above.

### Landing page sentences and sentence-like units

| Words | Exact copy | Copy result |
| ---: | --- | --- |
| 6 | `Your work stays on this device.` | OK; unlisted claim F-1-4 |
| 5 | `Field ledger № 01 / local utility` | F-1-49 |
| 3 | `One bill in.` | F-1-48 |
| 3 | `Clean costs out.` | F-1-48 |
| 15 | `Split a mixed supplier bill into client-reimbursable and overhead rows—without duplicating the original expense.` | F-1-1, F-1-5, F-1-60 |
| 3 | `Start this split` | F-1-55 |
| 3 | `One source document.` | OK |
| 4 | `Two clearly marked destinations.` | OK |
| 4 | `No saved slips yet.` | OK |
| 7 | `Your first balanced bill will appear here.` | OK |
| 7 | `Backup files contain slip details, not attachments.` | OK |
| 3 | `Name the original` | F-1-50 |
| 4 | `Required fields are marked *.` | OK |
| 3 | `Two decimal places.` | OK |
| 9 | `Tax included if it is on the source bill.` | OK |
| 4 | `Keep the source attached` | OK |
| 8 | `Photo or PDF, stored only in this browser.` | F-1-6 |
| 3 | `Maximum 10 MB.` | F-1-7 |
| 3 | `No attachment yet` | OK |
| 3 | `Mark every cost` | F-1-51 |
| 7 | `Categories are your labels—not tax advice.` | OK |
| 3 | `Close the ledger` | F-1-52 |
| 10 | `Enter the bill total and allocations to check the split.` | F-1-60 |
| 4 | `Take it to invoicing` | F-1-53 |
| 12 | `Exports preserve one source reference and your selected treatment for every row.` | F-1-8, F-1-60 |
| 8 | `Review your bookkeeping and tax treatment before importing.` | F-1-60 |
| 10 | `Split Cost Slip does not give tax or accounting advice.` | OK |
| 3 | `The long-job edition` | F-1-54 |
| 4 | `Five slips are free.` | F-1-9 |
| 6 | `Keep every job for $19 once.` | F-1-10 |
| 9 | `Pro unlocks unlimited on-device history and one-click slip duplication.` | F-1-11, F-1-60 |
| 11 | `The split, attachment, CSV, client list, and backups always remain free.` | F-1-12 |
| 4 | `See the one-time unlock` | F-1-57 |
| 12 | `Original hero artwork generated with the factory image model; no stock imagery.` | F-1-13 |
| 9 | `Nothing leaves your device except an optional license check.` | F-1-14 |
| 2 | `Unlimited slips.` | F-1-11 |
| 2 | `$19 once.` | F-1-10 |
| 14 | `Archive every mixed bill on this device and duplicate prior splits for repeat suppliers.` | F-1-11, F-1-60 |
| 7 | `Core exports, attachments, and backups stay free.` | F-1-12 |
| 5 | `Checkout is hosted by Sociobot.` | F-1-15 |
| 14 | `Sociobot/Dodo is the merchant of record and handles refunds; a refund revokes the license.` | F-1-16 |
| 3 | `Have a license?` | OK |
| 2 | `Paste it` | OK |
| 3 | `Verify and restore` | F-1-58 |

### Landing controls

| Words | Exact control | Result |
| ---: | --- | --- |
| 2 | `Saved slips` | OK for a disclosure control |
| 2 | `Unlock Pro` | OK; literal unlock |
| 3 | `Start this split` | F-1-55 |
| 3 | `New split slip` | F-1-56 |
| 2 | `Export backup` | OK |
| 2 | `Import backup` | OK |
| 2 | `Attach bill` | OK |
| 2 | `Open attachment` | OK |
| 3 | `Add cost row` | OK |
| 2 | `Save slip` | OK |
| 2 | `Export CSV` | OK |
| 3 | `Copy client lines` | OK |
| 3 | `Print client list` | OK |
| 2 | `Delete slip` | OK |
| 4 | `See the one-time unlock` | F-1-57 |
| 3 | `Buy Pro securely` | F-1-59 |
| 3 | `Verify and restore` | F-1-58 |
| 3 | `Remove this license` | OK |

### README sentences and copy units

| Words | Exact copy | Copy result |
| ---: | --- | --- |
| 3 | `Split Cost Slip` | OK |
| 23 | `Split Cost Slip is a local-first PWA for time-and-materials contractors who receive one supplier bill containing both their own overhead and client-reimbursable costs.` | F-1-61, F-1-64 |
| 33 | `Attach the source bill, divide its exact total into named rows, mark each row billable or overhead, and take a clean CSV or client-ready line list into the accounting tool you already use.` | F-1-62 |
| 2 | `Live product` | OK |
| 3 | `What v1 includes` | OK |
| 9 | `Integer-cent calculations with an explicit balanced / under / over state` | F-1-64 |
| 8 | `Billable and overhead rows with user-selected category labels` | OK |
| 11 | `Local attachment retention for images and PDFs up to 10 MB` | OK; unlisted claim F-1-21 |
| 9 | `IndexedDB persistence, five-slip free archive, and unlimited Pro archive` | F-1-60, F-1-64 |
| 9 | `CSV, client line list, print view, and JSON backup/import` | OK; unlisted claim F-1-23 |
| 9 | `Installable manifest, responsive 390px layout, and offline app shell` | F-1-64 |
| 13 | `One-time $19 Pro license via the hosted Sociobot checkout; no embedded payment provider` | OK; false claim F-1-25/F-1-36 |
| 5 | `Standalone /privacy/ and /terms/ pages` | OK; unlisted claim F-1-26 |
| 20 | `This is a focused reconciliation companion, not a general ledger, bank feed, guaranteed OCR tool, or source of tax advice.` | F-1-64 |
| 1 | `Develop` | OK |
| 5 | `Requires Node.js 20 or newer.` | OK |
| 9 | `Vite serves the app at the URL printed in the terminal.` | OK |
| 9 | `Browser data is stored only for that local origin.` | OK; unlisted claim F-1-27 |
| 3 | `Test and build` | OK |
| 4 | `Playwright 1.58.2 is pinned.` | OK |
| 14 | `If its Chromium binary is not already available, run npx playwright install chromium once.` | OK |
| 25 | ``npm test` runs deterministic money unit tests and Chromium browser tests on desktop and a Pixel 5 profile, including axe accessibility and offline reload checks.` | F-1-63 |
| 18 | `The exact production build command is npm run build; deploy the generated dist/ directory, whose root contains index.html.` | OK; unlisted claim F-1-29 |
| 6 | `To inspect the production build locally:` | OK |
| 3 | `Privacy and storage` | OK |
| 7 | `Slips and attachments live in browser IndexedDB.` | F-1-64; unlisted claim F-1-30 |
| 16 | `There is no analytics, account, ad technology, remote bill upload, CDN font, or third-party runtime script.` | OK; unlisted claim F-1-31 |
| 11 | `The only optional external request is daily license verification for Pro.` | OK; unlisted claim F-1-32 |
| 10 | `JSON backups omit attachments, so retain original supplier files separately.` | OK; unlisted claim F-1-33 |
| 2 | `Project notes` | OK |
| 6 | `Visual rationale and image provenance: .factory/design.md` | OK |
| 7 | `Delivery verification and known gaps: .factory/handoff.md` | OK |
| 2 | `License: MIT` | OK |

## Claim and behavior evidence

| Check | Result |
| --- | --- |
| `.factory/claims.json` | **BLOCKING:** missing |
| Declared claim commands | None available to run |
| Repository `@claim:` tags | None found |
| `npm ci` | PASS; 61 packages, 0 vulnerabilities |
| `npm test` | PASS; 3/3 Vitest and 12/12 Playwright tests |
| `npm run build` | PASS; `dist/` emitted, app JS 27.54 kB raw / 9.24 kB gzip |
| Warm offline reload | PASS; saved shell loaded and status became `Offline — ready to keep working` |
| Ordinary-flow request interception | PASS for that limited flow; zero cross-origin requests |
| Demo storage isolation | **FAIL:** `/demo` reads the real saved slip |
| Invalid-money export | **FAIL:** invalid `10.999` exported stale `10.00` while “Balanced exactly” remained |
| Malformed import | **FAIL:** persistent page error after reload |
| First-input attachment reload | **FAIL:** attachment association disappears |
| Pro checkout | **FAIL:** HTTP 404 |

The offline/privacy passes are not acceptance evidence because the required seeded demo and claim entries are absent.

## Structure, links, accessibility, and visual identity

- Link crawl: root, Privacy, Terms, and GitHub Source return 200. Pro checkout returns 404.
- Root basics: `lang=en`, one h1, one main landmark, alt text present, no unlabeled buttons, and no load console/page errors. The factory URL verifier passed these limited checks in 591 ms.
- Axe: root has zero WCAG 2 A/AA violations at desktop and 390 px. Privacy and Terms each have the serious contrast failure in F-1-38.
- Deep links: Privacy and Terms load directly. `/demo` is not a demo; unknown paths silently render home.
- Visual identity: **PASS.** The monochrome job-cost broadsheet, safety-orange mark, typography, original hero artwork, and near-square sheet treatment are recognizably product-specific rather than a generic SaaS card/gradient template. `.factory/design.md` records palette, type, spacing, motion, rationale, and provenance.
- Motion: reduced-motion CSS is present. Mobile has no horizontal overflow in the checked viewport.

## What would make this perfect

1. Fix the three data/purchase failures and add exact regression tests.
2. Ship the isolated, seeded `/demo` with banner, reset, exit, documentation, and a first-screen entry point.
3. Create a complete claims registry and make every retained promise pass from that demo.
4. Rewrite the first screen and terminology so the audience, job, first action, and three facts are immediately visible at 390 px and desktop.
5. Complete 404/routing, metadata, common chrome, sitemap, focus handling, response headers, cache policy, and touch targets.
6. Make every route pass axe and include every route in the automated suite.
7. Rerun this entire adversarial checklist against the deployed candidate. PASS only when the resulting review contains no finding of any severity.
