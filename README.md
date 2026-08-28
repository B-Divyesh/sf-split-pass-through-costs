# Split Cost Slip

Split one supplier bill into billable costs and overhead.

It is for contractors who need to separate client costs from their own overhead.

Attach the supplier bill and enter each cost row. Mark each row billable or overhead. Export a CSV or client line list.

Try the sample: <https://split-pass-through-costs.sociobot.in/?demo=1>

## What it includes

- CSV keeps each row's supplier bill reference, category, amount, currency, and billable or overhead choice.
- Client line lists and printed client line lists include billable rows only.
- Images and PDFs up to 10 MB are stored in this browser.
- Saved slips and attachments stay in this browser.
- Exact cent totals show balanced, under, and over states.
- JSON backups export saved slip details without attachment files.
- A separate sample demo never reads or writes real slips.
- Install Split Cost Slip as an app in supported browsers.
- It works offline after the first visit.
- Saving and exports are free.

Optional extraction sends the named attachment to Sociobot only after you start it.

It uses your Sociobot key and returns editable bill details. You choose billable or overhead for every suggested line.

Manual entry remains available offline. Split Cost Slip does not replace accounting software or provide tax advice.

## Develop

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Real records use browser storage for that origin. The demo uses separate browser storage.

## Test and build

Playwright 1.58.2 is pinned. If Chromium is missing, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

`npm test` runs money, desktop, mobile, accessibility, privacy, extraction, and offline tests.

The production build is `npm run build`. Deploy the generated `dist/` directory.

Every visitor-facing claim is listed in [`.factory/claims.json`](.factory/claims.json).

Run each listed command from a fresh checkout. Demo details are in [`.factory/demo.md`](.factory/demo.md).

## Privacy and storage

The demo sends no requests to other websites. Manual bill entry, storage, and exports stay in this browser.

Extraction sends the named attachment to `api.sociobot.in` only after you start it. Your key remains removable from the extraction panel.

Backup files omit attachments, so keep original attachments separately.

## Project notes

- Visual rationale and image provenance: [`.factory/design.md`](.factory/design.md)
- Delivery evidence: [`.factory/handoff.md`](.factory/handoff.md)
- License: [MIT](LICENSE)
