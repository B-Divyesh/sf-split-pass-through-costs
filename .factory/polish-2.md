# Polish 2 — adversarial finding disposition

Repaired from review candidate `7c568b5b9fad1d5ccc8c292231afb13592880c9b`. Local screenshots: `/tmp/split-demo-mobile-polish2.png` and `/tmp/split-root-desktop-polish2.png`. The live recheck URL after deployment is `https://split-pass-through-costs.sociobot.in`.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | `/demo` now removes landing content and opens with a completed, visible sample summary and editable sample slip. | `@claim:demo-isolation`; `/tmp/split-demo-mobile-polish2.png` |
| F-2-2 | The attachment claim now reloads a PNG and a 10 MB PDF, then rejects a 10,000,001-byte PDF. | `@claim:attachment-boundary` |
| F-2-3 / F-1-8 | CSV claim parses the header and every exact field for all three sample rows. | `@claim:split-export` |
| F-2-4 / F-1-31 | Privacy claim exercises attachment, save, CSV, copy, print, backup, import, reset, and demo exit under request interception. | `@claim:local-privacy` |
| F-2-5 / F-1-12 | Free claim saves, reloads, downloads CSV, and reads copied client output without a license. | `@claim:free-core` |
| F-2-6 / F-1-8 | Output wording and registry now use the full supplier-bill/reference/category/treatment CSV promise. | `@claim:split-export` |
| F-2-7 / F-1-20 | Category is parsed and asserted for every exported sample row. | `@claim:split-export` |
| F-2-8 / F-1-23 | Copy and print now generate billable-only client line lists; backup export and import are exercised. | `@claim:client-output`; `@claim:backup-omits-attachments`; malformed-import regression |
| F-2-9 / F-1-24 | Manifest claim verifies standalone display, versioned start URL, 192/512 icons, reachable assets, and service worker. | `@claim:installable-app` |
| F-2-10 / F-1-31 | Removed broad account/tracking/CDN absence language; retained the fully intercepted demo-flow promise only. | `@claim:local-privacy`; copy audit |
| F-2-11 / F-1-33 | Backup claim downloads JSON after attachment and proves attachment bytes are absent. | `@claim:backup-omits-attachments` |
| F-2-12 | Added persistence and cent-state registry entries with observable browser tests. | `@claim:slip-persistence`; `@claim:cent-balance` |
| F-2-13 / F-1-44 | Privacy, Terms, and 404 now have route metadata, OG/Twitter fields, canonical URLs, and 180px apple-touch icon. | route metadata test; build output |
| F-2-14 / F-1-45 | Root, demo, legal pages, and 404 share the same wordmark, nav links, footer links, and build label. | route metadata/shared chrome test; screenshots |
| F-2-15 / F-1-60 | Standardized visitor language on supplier bill, attachment, and client line list. | `.factory/copy-audit.md`; repository copy search |
| F-2-16 | Replaced `clear`, `namespace`, and visitor-facing `IndexedDB` language with direct product wording. | `.factory/copy-audit.md` |
| F-2-17 | Demo labels now read `Sample slips`, `Sample records`, and `Sample record`; the banner retains the required isolation wording. | `@claim:demo-isolation`; demo screenshot |

## Cumulative review 1 confirmation

Every review-1 identifier remains explicitly accounted for. Reopened items point to their review-2 repair above; all others were rechecked by the current suite.

| Finding id | Current change/evidence |
| --- | --- |
| F-1-1 | Contractor-first wording and actions above fold; root screenshot. |
| F-1-2 | Isolated seeded demo; `@claim:demo-isolation`. |
| F-1-3 | Complete registry and unique claim tags; `claims.json`. |
| F-1-4 | Demo/real isolation; `@claim:demo-isolation`. |
| F-1-5 | Invalid values block output; invalid-money regression. |
| F-1-6 | Attachment-first persistence; `@claim:attachment-boundary`. |
| F-1-7 | Exact attachment boundary; `@claim:attachment-boundary`. |
| F-1-8 | Repaired as F-2-3/F-2-6; `@claim:split-export`. |
| F-1-9 | Removed five-slip limit and claim; free-core flow. |
| F-1-10 | Removed unavailable checkout offer; route/link test. |
| F-1-11 | Removed untestable Pro promise; copy audit. |
| F-1-12 | Repaired as F-2-5; `@claim:free-core`. |
| F-1-13 | Removed untestable footer provenance claim; copy audit. |
| F-1-14 | Narrow privacy claim; `@claim:local-privacy`. |
| F-1-15 | Removed dead checkout wording; copy audit. |
| F-1-16 | Removed unsupported merchant/refund wording; copy audit. |
| F-1-17 | Contractor-specific README; copy audit. |
| F-1-18 | Complete split/export flows; claim suite. |
| F-1-19 | Invalid money cannot balance/export; regression. |
| F-1-20 | Repaired as F-2-7; `@claim:split-export`. |
| F-1-21 | Image/PDF retention/boundary; attachment claim. |
| F-1-22 | Removed capped/Pro archive promise; copy audit. |
| F-1-23 | Repaired as F-2-8; client/backup claims. |
| F-1-24 | Repaired as F-2-9; manifest/offline claims. |
| F-1-25 | Removed unavailable license claim; copy audit. |
| F-1-26 | Legal routes test zero serious/critical axe violations. |
| F-1-27 | Demo storage separation; demo claim. |
| F-1-28 | README test scope matches suite; `npm test`. |
| F-1-29 | Build emits `dist/index.html`; `npm run build`. |
| F-1-30 | Slip/attachment association; persistence claim. |
| F-1-31 | Repaired as F-2-4/F-2-10; privacy claim. |
| F-1-32 | Removed license request path; request interception. |
| F-1-33 | Repaired as F-2-11; backup claim. |
| F-1-34 | Invalid-money regression passes. |
| F-1-35 | Atomic malformed-import regression passes. |
| F-1-36 | Removed dead purchase path; copy/link check. |
| F-1-37 | Attachment-only association persists; attachment claim. |
| F-1-38 | Legal routes included in axe test. |
| F-1-39 | SWA security headers retained; config inspection. |
| F-1-40 | Immutable asset/no-cache worker policy retained; config inspection. |
| F-1-41 | Footer targets retain 44px sizing; mobile axe/screenshot. |
| F-1-42 | Full visible wordmark retained on mobile; mobile screenshot. |
| F-1-43 | Static and SPA 404 routes tested. |
| F-1-44 | Repaired as F-2-13; metadata test. |
| F-1-45 | Repaired as F-2-14; shared chrome test. |
| F-1-46 | Destination headings and route announcers retained; route test. |
| F-1-47 | Facts, three steps, and limits on landing; root screenshot. |
| F-1-48 | Plain job headline retained; copy audit. |
| F-1-49 | Contractor audience eyebrow retained; copy audit. |
| F-1-50 | Supplier-bill section heading retained; copy audit. |
| F-1-51 | Cost-row section heading retained; copy audit. |
| F-1-52 | Balance section heading retained; cent-balance claim. |
| F-1-53 | Output section heading retained; split-export claim. |
| F-1-54 | Paid section remains absent; copy audit. |
| F-1-55 | Sample action remains primary; root screenshot. |
| F-1-56 | Create-new-slip action remains keyboard operable; app test. |
| F-1-57 | Paid-details action remains absent; copy audit. |
| F-1-58 | License-restore action remains absent; copy audit. |
| F-1-59 | Buy-Pro action remains absent; free-core claim. |
| F-1-60 | Repaired as F-2-15; terminology audit. |
| F-1-61 | README opener remains short; copy audit. |
| F-1-62 | README workflow remains short sentences; copy audit. |
| F-1-63 | README test description remains short; copy audit. |
| F-1-64 | README avoids implementation jargon in product copy; copy audit. |

No review finding is intentionally deferred.
