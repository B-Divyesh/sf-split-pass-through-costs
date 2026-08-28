# Split Cost Slip

Split Cost Slip is a local-first PWA for time-and-materials contractors who receive one supplier bill containing both their own overhead and client-reimbursable costs. Attach the source bill, divide its exact total into named rows, mark each row billable or overhead, and take a clean CSV or client-ready line list into the accounting tool you already use.

Live product: <https://split-pass-through-costs.sociobot.in>

## What v1 includes

- Integer-cent calculations with an explicit balanced / under / over state
- Billable and overhead rows with user-selected category labels
- Local attachment retention for images and PDFs up to 10 MB
- IndexedDB persistence, five-slip free archive, and unlimited Pro archive
- CSV, client line list, print view, and JSON backup/import
- Installable manifest, responsive 390px layout, and offline app shell
- One-time $19 Pro license via the hosted Sociobot checkout; no embedded payment provider
- Standalone `/privacy/` and `/terms/` pages

This is a focused reconciliation companion, not a general ledger, bank feed, guaranteed OCR tool, or source of tax advice.

## Develop

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite serves the app at the URL printed in the terminal. Browser data is stored only for that local origin.

## Test and build

Playwright 1.58.2 is pinned. If its Chromium binary is not already available, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

`npm test` runs deterministic money unit tests and Chromium browser tests on desktop and a Pixel 5 profile, including axe accessibility and offline reload checks. The exact production build command is `npm run build`; deploy the generated `dist/` directory, whose root contains `index.html`.

To inspect the production build locally:

```sh
npm run preview
```

## Privacy and storage

Slips and attachments live in browser IndexedDB. There is no analytics, account, ad technology, remote bill upload, CDN font, or third-party runtime script. The only optional external request is daily license verification for Pro. JSON backups omit attachments, so retain original supplier files separately.

## Project notes

- Visual rationale and image provenance: [`.factory/design.md`](.factory/design.md)
- Delivery verification and known gaps: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
