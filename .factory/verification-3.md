# Independent product verification 3 — FAIL

Verified 2026-08-29 for work order `split-pass-through-costs-verify-3`.

- Candidate: `ee52c78c1a820c04caaa4c6b9590fe3b8e785eec`
- Repository/branch: `B-Divyesh/sf-split-pass-through-costs`, `main`
- Public URL: <https://split-pass-through-costs.sociobot.in>
- Artifact: offline/local-first PWA
- Final result: **FAIL**

The candidate is deployed and the normal split/export workflow is strong. All registered claim commands pass after the clean dependency install, the exact default test gate passes, and accessibility, privacy, headers, caching, installability, offline/update behavior, bundle budgets, and Lighthouse targets pass. Release is blocked by two fresh core-data findings: an attachment chosen as the first real input becomes an inaccessible and undeletable IndexedDB orphan after reload, and malformed comma grouping is silently accepted as a different amount and can still produce `Balanced exactly`.

No product code was changed during verification.

## Mandatory first-read and demo gate

**PASS.** A cold 1440×900 live load returned HTTP 200 with no console or page errors. The first screen answers all three required questions in plain words:

- What: `Split one bill into billable and overhead costs.`
- For whom: `For contractors who need to separate client costs from their own overhead.`
- First action: `Try it with sample data`, beside copy explaining that a completed supplier bill opens.

One click opened `/?demo=1` with Sunrise Building Supply, reference `SBS-48192`, the Juniper Kitchen Remodel, a `$1,287.50` total, two billable rows, one overhead row, and `Balanced exactly`. The persistent banner says `Demo — sample data, nothing is saved` and exposes `Reset demo` and `Start for real`.

Evidence:

- [`verification-artifacts/live-first-read-desktop.png`](verification-artifacts/live-first-read-desktop.png)
- [`verification-artifacts/live-after-sample-click.png`](verification-artifacts/live-after-sample-click.png)
- [`verification-artifacts/verify-url-live/screenshot-mobile.png`](verification-artifacts/verify-url-live/screenshot-mobile.png)

## Claims gate

`.factory/claims.json` exists with 14 entries. In the untouched clone, the literal first invocation of every listed command stopped before discovery because dependencies were not installed (`ERR_MODULE_NOT_FOUND: @playwright/test`). After the required `npm ci`, every exact command was rerun separately and passed in both configured projects:

| Claim | Exact post-install result |
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

The initial module-resolution result is setup evidence, not a behavioral assertion. The standard clean install succeeded. However, the attachment claim tests exercise a populated demo or saved slip, not the allowed attachment-first real workflow. Defect 1 demonstrates that the registered attachment and deletion promises are false in that omitted state.

Landing, README, Privacy, and Terms claim-like statements otherwise map to the registry. The copy audit contains no sentence over 22 words or banned marketing term.

## Candidate and live identity

Verification began with `HEAD`, `origin/main`, and the requested candidate all at `ee52c78c1a820c04caaa4c6b9590fe3b8e785eec`. The only initial worktree additions were verifier-generated evidence.

The exact clean production build matches the live origin byte-for-byte for every material file checked, including root/demo/legal/error HTML, application JS/CSS, service worker, manifest, route script, robots, sitemap, hero/social artwork, and icons. Examples:

| Artifact | Candidate/live SHA-256 |
| --- | --- |
| `index.html` | `f7217d28ed3c99ac1a307a3bd69ac94f6a81a5ea04ce0b48905cea7263a7ec47` |
| `assets/main-DKCa7sMB.js` | `96569cf845f2663628e8c19f9ee7b8671e037d18b1cac44b4056404f57379c9f` |
| `assets/main-D9MIFWQ5.css` | `6ced155b5486619007e37bde02f9fd676d6db9f418d8ea1878f969808ef43c44` |
| `sw.js` | `8d764db0204434c0516f0e3142fb50a4f397247f55b9ab21eb3a2fd09eee9b1f` |
| `manifest.webmanifest` | `abbc9c34c0c0c3524ce09c3ca8736caff65a7ee633256b1ba213fb18a9a19056` |
| `privacy/index.html` | `6c3835b53a7ed559a02d1603da9b06ef8b2cb56c36fa2dcfe5caff32a4174735` |

A true unknown path returns the designed page with HTTP 404. This proves that the defects below belong to the requested candidate, not a stale deployment.

## Clean repository gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages, 0 vulnerabilities |
| All 14 exact claim commands | PASS after install — 28 browser runs |
| `npm test` | PASS — 3/3 Vitest and 52/52 Playwright in 2.5 minutes |
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS — includes typecheck and emits `dist/` |
| `npm audit --audit-level=low` | PASS — 0 vulnerabilities |
| Lint | Not available — no lint script or lint configuration |

The current one-worker Playwright configuration closes the prior verifier's reproducible default-suite failure.

Production output is 42,960 B JavaScript (13.13 kB gzip), 19,879 B CSS (5.03 kB gzip), no web fonts, and a 58,066 B hero WebP. These pass the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB hero budgets.

## Independent product exercise

Passing live behavior:

- Created a representative EUR `100.01` supplier bill split into `33.33` billable and `66.68` overhead, attached a PDF, saved, reloaded through its `?slip=<id>` URL, and retained exact values and attachment.
- Exported CSV with every promised field. Formula-leading supplier/reference/client/description cells were neutralized.
- Copied and printed a client line list containing only the billable row and correct `€33.33` reimbursement total.
- A `0.02` row against a `0.01` bill blocked export. `0.001` set `aria-invalid=true`, announced the error, and changed the state to `Fix invalid amount`; correcting it restored exact balance.
- Missing supplier and unnamed nonblank rows are blocked; blank zero placeholders are omitted; empty Save focuses Supplier and announces the correction.
- Valid image/PDF attachments, exact 10,000,000/10,000,001-byte limits, saved-slip reload, malformed-import recovery, row removal/Undo, deletion of a normally saved slip, backup omission, and demo isolation pass the committed suite.
- Demo extraction uses the recorded result. A real invalid key made no request until explicit extraction, then made only `GET https://api.sociobot.in/v1/models`, returned 401 cleanly, did not send attachment bytes, and remained removable. No factory Sociobot key was present for a paid live extraction.

Failing behavior is below.

## Defects

### High — release blocking

1. **An attachment chosen as the first input is orphaned, disappears on reload, and cannot be deleted through the product.**

   On fresh live `/?new=1` at 390 px, choose a valid `first-input.pdf` before entering Supplier or other fields. The UI says `Supplier bill attached in this browser` and shows `first-input.pdf · 1 KB`, but IndexedDB contains `{slips: 0, attachments: 1}`. Reload changes the UI to `No attachment yet` while the database still contains `{slips: 0, attachments: 1}`. Confirming `Delete slip` then reports `Slip and attachment deleted`, but the attachment count remains 1.

   The allowed receipt-first workflow and the promises `Images and PDFs up to 10 MB are saved in this browser`, `Saved slips and attachments stay in this browser`, and `Deleting a slip removes its saved details and attachment` therefore fail in this state. The blob is no longer accessible or removable except by clearing site data. Source inspection confirms `handleAttachment()` writes the blob, then calls a silent save now rejected by required-supplier validation. This is a regression introduced while fixing the prior verifier's validation finding, and the tagged tests miss the empty real-slip start.

   Evidence:

   - [`verification-artifacts/attachment-first-before-reload.png`](verification-artifacts/attachment-first-before-reload.png)
   - [`verification-artifacts/attachment-first-after-reload.png`](verification-artifacts/attachment-first-after-reload.png)

2. **Malformed comma grouping is silently converted to a different amount and can be declared balanced.**

   Enter bill total `1,2,3`, enter a named row amount `123`, and inspect the live result. The bill input keeps `1,2,3`, has `aria-invalid=false`, and the product reports `Every cent of the supplier bill is accounted for` / `Balanced exactly` at `$123.00`. `parseMoney()` removes every comma before validating syntax, so arbitrary grouping such as `1,2,3` is treated as `123.00` rather than rejected. A matching malformed value can be saved and exported as the wrong financial amount.

   This is the same core reconciliation class as the earlier over-precision defect: unsupported input must not retain a valid balance. Validate comma grouping before removing separators, announce the error, and cover malformed groupings in unit and browser tests.

   Evidence: [`verification-artifacts/malformed-comma-balanced.png`](verification-artifacts/malformed-comma-balanced.png).

### Low

1. **A legacy deployment control file is publicly served.** `https://split-pass-through-costs.sociobot.in/_headers` returns HTTP 200 as `application/octet-stream`. `staticwebapp.config.json` correctly returns 404. The exposed `_headers` contains no secret, but it is unnecessary public implementation detail.

## Privacy, security, requests, and server scope

- The complete live demo flow—load, recorded extraction, attachment, save, CSV, copy, print, backup export/import, reset, and exit—made 11 requests to one origin only. No attachment marker appeared in any request.
- The independent real manual flow also made zero cross-origin requests and no console/page errors.
- Optional real extraction contacts only `api.sociobot.in` after explicit action. An invalid-key check sent no request body and no attachment bytes.
- Live headers include HTTP→HTTPS 301, HSTS, CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, and strict referrer policy.
- Root HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS use one-year immutable caching; `sw.js` uses `no-cache`.
- All crawled internal links, GitHub Source, and Sociobot key links returned 200. Unknown routes return 404.
- This static PWA has no product-owned backend, unlock call, sign-in, health/build endpoint, or documented server request allowance. Backend concurrency/persistence, 429/`Retry-After`, build identity, and Microsoft Entra checks are not applicable. The optional authenticated Sociobot gateway is external.

## Accessibility, mobile, keyboard, and motion

- Live Axe WCAG 2 A/AA: zero violations on `/`, `/demo`, `/privacy/`, `/terms/`, `/offline.html`, `/404.html`, an unknown 404, and the open extraction dialog at desktop and 390 px.
- Each route has `lang=en`, one `h1`, one main landmark, route-specific metadata, useful image alt text, and no normal 390 px horizontal overflow.
- Factory `verify-url.sh` passed: HTTP 200, 909 ms network-idle load, zero console/page errors, title/lang/main/one h1, zero missing alt, and zero unlabeled buttons. Evidence: [`verification-artifacts/verify-url-live/verify.json`](verification-artifacts/verify-url-live/verify.json).
- Keyboard checks passed for entering a bill, add/remove/Undo row actions, archive disclosure, dialog entry/Escape/return focus, and labelled controls. Focus has a visible 3 px orange outline; the skip link becomes visible when reached.
- All checked mobile targets are at least 44×44 CSS px. Reduced-motion mode computes to automatic scrolling and `0.00001s` transitions/animations.
- Screenshots were visually inspected. The broadsheet hierarchy, workbench art, warm-paper palette, safety-orange marks, responsive stacking, and output controls match `.factory/design.md` and remain legible.

## PWA, offline, and update behavior

- Live manifest: standalone, versioned `/?v=1` start URL, 192/512 icons, maskable icon, matching colors, and zero Chromium installability errors.
- After a warm live demo load, offline reload remained service-worker controlled, retained Sunrise data and exact balance, showed `Offline — ready to keep working`, and accepted edits. Cache: `split-cost-slip-v9`.
- An exact-build service-worker simulation served a changed worker body after the page was controlled. `registration.update()` produced `A fresh edition is ready. Reload` with an operable Reload button and no errors.

## Performance

Live Lighthouse 12.5.1 mobile:

| Category/metric | Result |
| --- | --- |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | 1.01 s |
| LCP | 1.31 s |
| TBT | 144 ms |
| CLS | 0.00050 |
| Speed Index | 1.01 s |

Event Timing across primary mobile interactions measured a maximum 16 ms event duration, below the 200 ms interaction budget. Lighthouse transferred 13,477 B of application JS, 5,330 B of CSS, and 58,152 B of hero image data.

## Scope note

The researched brief describes one-time monetization, but the candidate ships the complete utility free and has no checkout, license, or paid tier. This avoids the previously broken purchase path and does not impair the job-to-be-done, but it is a deliberate business-scope deviation and should be recorded rather than described as no known gap.

## Release decision

**FAIL. Do not approve candidate `ee52c78c1a820c04caaa4c6b9590fe3b8e785eec` for release.** Preserve attachment association and deletion when the attachment is the first input, extend the registered claims to that exact state, and reject malformed comma grouping before balance/save/export. Then deploy and rerun independent verification.
