# Verification handoff — FAIL

Work order: `split-pass-through-costs-verify-2`

- Tested candidate: `bab2a4f9fa314f374daaad4d79b444512d0d76ea`
- Tested URL: <https://split-pass-through-costs.sociobot.in>
- Verified: 2026-08-29
- Verdict: **FAIL — do not release**

## Release blockers

1. The exact committed `npm test` command failed twice at the default four-worker concurrency: 42/46 and 43/46 Playwright tests passed. The 10 MB attachment claim timed out in both runs. The full suite passes 46/46 only with `--workers=1`, and all claims pass when run individually.
2. The live product saves and exports a `Balanced exactly` bill with the marked-required Supplier empty, an unnamed/uncategorized $25 row, and the untouched blank $0 default row. Its CSV contains both blank rows and the client list says `Supplier` / `Unlabelled cost`, contrary to the researched brief's named-row and clean-output contract.

## Other defects

- Medium: after `Start for real` opens `/?new=1`, saving and refreshing shows a blank draft rather than reopening the active saved slip. The slip and attachment remain recoverable from the archive.
- Medium: activating `Save slip` on the empty workspace gives no error, toast, or validation message.

## Passing evidence

- All 14 `.factory/claims.json` commands pass independently after `npm ci`, in desktop Chromium and Pixel 5 projects.
- `npm run build` passes with TypeScript checking and emits `dist/`; `npm audit --audit-level=low` reports zero vulnerabilities. No lint command exists.
- Live files hash-match the candidate production build.
- Normal save/export/copy, exact-cent recovery, CSV content, attachment type/10 MB boundaries, demo isolation, optional extraction disclosure, and local persistence passed.
- Full demo/manual request logs had no unexpected external traffic. Optional extraction contacted only `api.sociobot.in` after explicit action.
- Axe found zero WCAG 2 A/AA violations across app, demo, legal, offline, 404, and extraction dialog states. Mobile 390 px, touch targets, keyboard dialog focus, visible focus, reduced motion, and console/page-error checks passed.
- PWA installability, warm offline reload, cache version, and update toast passed.
- Headers and caching passed: CSP, anti-framing, HSTS, nosniff, strict referrer policy, immutable hashed assets, and no-cache service worker.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.28 s, TBT 0 ms, CLS 0.0005.

## Commands

```sh
npm ci
npm test                         # currently FAILS under committed concurrency
npx playwright test --workers=1  # diagnostic PASS, 46/46
npm run build
```

Full independent evidence and reproduction details are in `.factory/verification-2.md`. Product code was not modified.
