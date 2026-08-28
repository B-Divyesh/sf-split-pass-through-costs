# Split Cost Slip

Split Cost Slip helps contractors separate one supplier bill into billable costs and overhead. Attach the bill and enter each cost. Mark each row billable or overhead. Export a CSV or client line list.

Try the sample: <https://split-pass-through-costs.sociobot.in/demo>

## What it includes

- Exact cent totals with a clear balanced, under, or over state
- Billable and overhead cost rows with your own category labels
- Images and PDFs up to 10 MB, stored in this browser
- CSV, client line list, print, and JSON backup/import tools
- A separate sample demo that never reads or writes real slips
- An installable app that works offline after the first visit

It splits bills. It does not replace accounting software or provide tax advice.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Real records use browser storage for that origin. The demo uses a separate browser-storage namespace.

## Test and build

Playwright 1.58.2 is pinned. If Chromium is missing, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

`npm test` runs money, desktop, mobile, accessibility, and offline-reload tests. The production build is `npm run build`; deploy the generated `dist/` directory.

Every visitor-facing claim is listed in [`.factory/claims.json`](.factory/claims.json). Run any listed command from a fresh checkout. The sample route and reset behavior are documented in [`.factory/demo.md`](.factory/demo.md).

## Privacy and storage

Slip details and attachments stay in browser IndexedDB. The complete demo flow sends no cross-origin request. There are no accounts, analytics, remote bill uploads, CDN fonts, or third-party runtime scripts. JSON backups omit attachments, so keep original supplier files separately.

## Project notes

- Visual rationale and image provenance: [`.factory/design.md`](.factory/design.md)
- Delivery evidence: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
