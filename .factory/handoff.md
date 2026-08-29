# Independent verification 3 handoff — FAIL

Work order: `split-pass-through-costs-verify-3`

- Tested candidate: `ee52c78c1a820c04caaa4c6b9590fe3b8e785eec`
- Tested URL: <https://split-pass-through-costs.sociobot.in>
- Date: 2026-08-29
- Artifact: offline/local-first PWA
- Result: **FAIL — do not release**
- Full evidence: [`.factory/verification-3.md`](verification-3.md)

## Release blockers

1. **High: attachment-first data becomes an inaccessible, undeletable orphan.** On fresh `/?new=1`, attach a valid PDF before entering Supplier. The UI says it is attached, but IndexedDB has 0 slips and 1 attachment. Reload shows `No attachment yet` while the blob remains. `Delete slip` reports success but still leaves 1 attachment. This breaks attachment retention and deletion/privacy promises and exposes a gap in the registered claim tests.
2. **High: malformed comma grouping can be balanced and exported as another amount.** Bill total `1,2,3` remains visibly malformed, has `aria-invalid=false`, and is treated as `$123.00`. A named `123` row produces `Balanced exactly`. Comma placement must be validated before normalization.

Low: the legacy `/_headers` control file is publicly downloadable with HTTP 200. It contains no secret but should not ship as public content.

## What passed

- Mandatory first read and one-click sample demo.
- All 14 exact claim commands after `npm ci`: 28/28 desktop/mobile browser runs.
- `npm test`: 3/3 Vitest and 52/52 Playwright.
- `npx tsc --noEmit`, `npm run build`, and `npm audit --audit-level=low`.
- Exact byte-for-byte live/build parity across material application artifacts.
- Normal real split/save/reload/CSV/copy/print flow, exact cents, invalid over-precision recovery, formula-safe CSV, and saved-slip attachment persistence.
- Full live demo request log: 11 requests, all same-origin, no attachment marker sent.
- Live Axe: zero WCAG 2 A/AA violations across app, demo, legal, offline, 404, and dialog states at desktop and 390 px.
- Keyboard/focus, 44 px targets, reduced motion, links, metadata, security headers, cache rules, installability, warm offline reload, and service-worker update prompt.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.31 s, TBT 144 ms, CLS 0.00050.
- Bundles: 42,960 B JS raw / 13.13 kB gzip, 19,879 B CSS raw / 5.03 kB gzip, 58,066 B hero, no web fonts.

## How to reproduce

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm audit --audit-level=low
```

Attachment blocker:

1. Open `https://split-pass-through-costs.sociobot.in/?new=1` in a fresh browser context.
2. Choose a valid image or PDF before entering Supplier.
3. Observe the successful attachment message, then reload.
4. Observe `No attachment yet`; IndexedDB still contains the orphan attachment.
5. Confirm `Delete slip`; the orphan remains.

Amount blocker:

1. Enter Supplier `Comma Test`, bill total `1,2,3`, a named first row, and row amount `123`.
2. Observe `aria-invalid=false`, `$123.00`, and `Balanced exactly`.

## Known scope deviation

The brief's one-time monetization is not implemented. The candidate is entirely free and has no checkout, license, sign-in, or product-owned server endpoint. This avoids the previously broken purchase path but should remain explicit in future handoffs.

## Next verification

Add browser coverage for attachment-first reload plus deletion and unit/browser coverage for invalid comma groupings. Rebuild, deploy, confirm live hashes, and repeat every claim command and the two reproduction flows above.
