# Independent product verification 2 — FAIL

Verified 2026-08-29 for work order `split-pass-through-costs-verify-2`.

- Candidate: `bab2a4f9fa314f374daaad4d79b444512d0d76ea`
- Repository/branch: `B-Divyesh/sf-split-pass-through-costs`, `main`
- Public URL: <https://split-pass-through-costs.sociobot.in>
- Artifact: offline/local-first PWA
- Final result: **FAIL**

The candidate is deployed and most product behavior is strong. The sample, normal split/export flow, local privacy, accessibility, offline behavior, installability, headers, caching, and performance all passed. Release is blocked because the repository's exact `npm test` gate fails reproducibly and the real workflow can export a supposedly finished split with no supplier and unnamed, uncategorized rows.

## Mandatory first-read and demo gate

**PASS.** A cold 1440×900 live load returned HTTP 200 with no console or page errors. The first screen says:

- What: “Split one bill into billable and overhead costs.”
- For whom: “For contractors who need to separate client costs from their own overhead.”
- First action: “Try it with sample data.” The adjacent sentence explains that it opens a completed supplier bill and that a real bill starts empty.

The one-click action opens `/?demo=1` with a completed Sunrise Building Supply bill, three realistic rows, an exact $1,287.50 balance, separate demo storage, a persistent demo banner, `Reset demo`, and `Start for real`.

## Claims gate

`.factory/claims.json` exists and contains 14 entries. As the literal first action in the untouched clone, every listed command exited at module resolution because dependencies had not yet been installed (`@playwright/test` was missing). After the required clean `npm ci`, every exact command was rerun independently and passed in both configured projects:

| Claim | Installed clean-clone result |
| --- | --- |
| `demo-isolation` | PASS — 2/2 |
| `split-export` | PASS — 2/2 |
| `attachment-boundary` | PASS — 2/2 |
| `local-privacy` | PASS — 2/2 |
| `offline-reload` | PASS — 2/2 |
| `free-core` | PASS — 2/2 |
| `client-output` | PASS — 2/2 |
| `backup-omits-attachments` | PASS — 2/2 |
| `slip-persistence` | PASS — 2/2 |
| `cent-balance` | PASS — 2/2 |
| `installable-app` | PASS — 2/2 |
| `manual-data-privacy` | PASS — 2/2 |
| `delete-slip-data` | PASS — 2/2 |
| `bill-extraction` | PASS — 2/2 |

The normal dependency install is required before the commands can exercise the product, so the post-install results above are the behavioral claims evidence. No unlisted visitor-facing functional or privacy promise was found in the landing page or README.

## Candidate and deployment identity

`HEAD` was exactly the requested candidate and the worktree was clean before verification. The production build and live origin had matching SHA-256 hashes for all material shipped artifacts: root and demo HTML, static 404/offline/privacy/terms pages, app JS/CSS, service worker, manifest, robots, sitemap, hero/social artwork, and all icons. Examples:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `65a18aa38237289fcb9e6d8a82487cf542a7ef1251e7dad10aa6769c9991f57e` |
| `assets/main-BinSV0vv.js` | `c43a5504b01ebf48fc6d46c3a18647abb71c5117382cf6aabd1611bbe42ab717` |
| `assets/main-D9MIFWQ5.css` | `6ced155b5486619007e37bde02f9fd676d6db9f418d8ea1878f969808ef43c44` |
| `sw.js` | `8d764db0204434c0516f0e3142fb50a4f397247f55b9ab21eb3a2fd09eee9b1f` |
| `manifest.webmanifest` | `abbc9c34c0c0c3524ce09c3ca8736caff65a7ee633256b1ba213fb18a9a19056` |

`staticwebapp.config.json` correctly returns the styled 404 rather than being exposed as a public file. This is fresh evidence that the live product matches candidate `bab2a4f9…`.

## Repository gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages, 0 vulnerabilities |
| All 14 exact claim commands | PASS after install |
| `npm test` attempt 1 | **FAIL** — 42/46 Playwright passed; four Chromium failures/timeouts, including `@claim:attachment-boundary`; Vitest 3/3 passed |
| `npm test` attempt 2 | **FAIL** — exit 1; 43/46 Playwright passed; attachment, axe, and mobile-target tests timed out in Chromium; Vitest 3/3 passed |
| `npx playwright test --workers=1` | PASS — 46/46; demonstrates default four-worker suite instability rather than consistent product assertions |
| `npm run build` | PASS — includes `tsc --noEmit`, emits `dist/` |
| Lint | Not available — no lint script or lint configuration |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |

The repeated exact `npm test` failure violates the repository definition of done even though isolated claim commands and a one-worker diagnostic pass.

Production output is 41,043 B JavaScript (12,961 B transferred/gzip in Lighthouse), 19,879 B CSS (5,369 B transferred), and 58,066 B hero WebP. These pass the 200 KB JS, 50 KB CSS, and 300 KB hero budgets.

## Independent live product exercise

Passing evidence:

- Completed a representative $10.00 supplier bill with $6.25 billable materials and $3.75 overhead delivery; saved it, inspected the CSV, and copied a client list containing only the $6.25 billable row.
- Entering `10.999` now sets `aria-invalid=true`, changes the balance to `Fix invalid amount`, announces a concrete correction, and blocks save/export. Correcting it restores an exact balance.
- Formula-sensitive CSV cells are neutralized in code, commas/newlines are quoted, cents are deterministic, and billable/overhead treatment is explicit.
- A text attachment is rejected with recovery guidance. A valid PDF is saved. An exact 10,000,000-byte PDF survives reload, while a 10,000,001-byte PDF is rejected without replacing it.
- Malformed backups are validated atomically by the shipped candidate tests. Delete removes both slip and attachment records.
- Demo extraction returns editable recorded suggestions, requires the user to choose billable/overhead, and makes no external request. In real mode, typing an invalid key made no request; the explicit extraction action made only `GET https://api.sociobot.in/v1/models`, failed softly, and did not upload the attachment.
- Demo and real storage use separate IndexedDB databases. Demo reset and leaving demo do not touch real slips.

Failing evidence is listed under Defects.

## Defects

### High — release blocking

1. **The exact repository test gate fails reproducibly at its committed concurrency.** Two fresh standalone `npm test` runs exited 1. The first had 42/46 Playwright passes and the second 43/46. Both timed out on the 10 MB attachment claim in desktop Chromium; axe/mobile checks also timed out, and the first run included a Chromium SIGSEGV cascade. The same 46 tests pass with `--workers=1`, and every isolated claim command passes. The checked-in `workers: 4` configuration therefore exceeds reliable capacity in the supplied clean verification environment. Definition of done explicitly requires `npm test` to pass.

2. **Finished exports do not enforce the product's required and named fields.** On fresh `/?new=1`, enter only bill total `25.00` and first-row amount `25.00`. Leave Supplier, Description, and Category empty; leave the default second row untouched. The UI says `Balanced exactly`, Save succeeds despite Supplier being marked required, and Export CSV succeeds. The emitted rows are:

   ```csv
   Supplier,Supplier bill reference,Bill date,Client,Description,User-selected category,Treatment,Amount,Currency
   ,,2026-08-29,,,,Billable,25.00,USD
   ,,2026-08-29,,,,Overhead,0.00,USD
   ```

   The client line list substitutes `Supplier` and `Unlabelled cost`. This is not the brief's named-row split or a clean reimbursement draft, and the zero-dollar placeholder row can be carried into accounting. Enforce the marked supplier requirement, require a name for every non-empty cost row, and omit or reject untouched zero rows before save/export. Add claim coverage for a fresh real bill, not only the fully populated demo.

### Medium

1. **The start-for-real URL does not restore the active saved slip on refresh.** `Start for real` opens `/?new=1`. After creating and saving a balanced slip with an attachment, reloading that unchanged URL shows a blank `Not saved yet` draft and `No attachment yet`. The saved-count remains 1 and the user can recover the intact slip through `Show saved slips`, so data is not lost, but the visible state does not survive refresh as the local-first contract requires. Consume or remove `new=1` after initializing the new workspace.

2. **Empty Save gives no feedback or validation.** On a fresh workspace, activating `Save slip` leaves `Not saved yet`, shows no toast, and leaves the validation live region empty. This makes the primary recovery path unclear and conflicts with the feedback/error-state contract. It is also part of why the required-field bypass is easy to miss.

## Accessibility, mobile, keyboard, and visual checks

- Axe WCAG 2 A/AA on live `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, `/404.html`, a true 404, and the open extraction dialog: zero violations of any impact, including zero serious/critical.
- Every checked page has `lang=en`, one `h1`, a `main` landmark, route-specific title, and no horizontal overflow at 390×844.
- All visible mobile links, buttons, and file actions measured at least 44×44 CSS px.
- Keyboard Enter/Space toggles the archive. Enter opens the extraction dialog, focus moves to the labelled close control, Escape closes it, and focus returns to the opener. Focus uses a visible 3 px orange outline.
- Reduced motion computes to automatic scrolling and effectively instant `0.00001s` transitions/animations.
- Desktop 1440×900 and mobile 390×844 full-page screenshots were visually inspected. The product-specific broadsheet hierarchy, responsive stacking, labels, totals, and output controls remain legible and usable.
- No console or page errors occurred in the independent live flows.

## Privacy, headers, links, and server scope

- The full live demo flow produced zero cross-origin requests. Manual entry, attachment, save, reload, export, copy, and offline behavior remained on-origin/local.
- Optional extraction contacts only `api.sociobot.in` after explicit user action. No Azure endpoint, analytics, remote font, remote script, or tracker was observed.
- Live responses include CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and HSTS. HTTP redirects to HTTPS with 301.
- Hashed JS/CSS and artwork return one-year immutable caching. `sw.js` returns `no-cache`; HTML revalidates after 30 seconds.
- Intended internal and external links returned 200. A true unknown route returns HTTP 404 with the designed recovery page.
- This static product has no product-owned backend, billing/unlock endpoint, or sign-in. Request-allowance/429, persistence/concurrency health, build-identity endpoint, and Entra checks are therefore not applicable. The optional BYOK Sociobot model gateway is an authenticated external service, not a product server endpoint.

## PWA and offline checks

- Chromium reports zero installability errors. Manifest has standalone display, versioned `/?v=1` start URL, 192/512 icons, and a maskable icon.
- After first load, live offline reload retains the seeded demo, reports `Offline — ready to keep working`, remains service-worker-controlled, and uses cache `split-cost-slip-v9`.
- A production-output update simulation served the unchanged candidate worker first, then only changed the served cache version. The new worker installed and the open app displayed `A fresh edition is ready. Reload`.

## Performance

Live Lighthouse 12.5.1 mobile run:

| Category/metric | Result |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 0.90 s |
| LCP | 1.28 s |
| TBT | 0 ms |
| CLS | 0.0005 |
| Speed Index | 0.90 s |

INP is not available from a synthetic no-interaction Lighthouse navigation. The zero-TBT result, small bundle, and direct interaction checks provide no indication of an INP budget problem.

## Release decision

**FAIL. Do not approve candidate `bab2a4f9…` for release.** Stabilize the exact default `npm test` gate and enforce supplier/named-row validity before save and output. Fix refresh behavior for `?new=1`, add clear empty-save feedback, deploy, and rerun independent verification.
