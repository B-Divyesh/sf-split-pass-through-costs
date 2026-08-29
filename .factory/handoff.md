# Repair 2 handoff

Work order: `split-pass-through-costs-repair-2`

- Base report commit: `3082264be14dc6fece9b5f4f57da995686ea6b5e`
- Failed product candidate repaired: `ee52c78c1a820c04caaa4c6b9590fe3b8e785eec`
- Product: offline/local-first static PWA
- Public URL: <https://split-pass-through-costs.sociobot.in>
- Date: 2026-08-29

## What changed

1. Attachment-first drafts now save the slip metadata and file in one IndexedDB transaction. The draft gets a stable `?slip=` URL, survives reload, remains openable, and deletes both records together.
2. Startup now removes attachment records that have no valid slip. This repairs blobs orphaned by the prior release without touching valid slips or their attachments.
3. Money parsing validates comma placement before removing separators. Valid grouped values such as `12,345,678.90` still work; malformed values such as `1,2,3` stay invalid and cannot balance, save, or export.
4. The claim sandboxes now begin with the verifier's exact attachment-first real workflow. Browser coverage asserts IndexedDB counts before reload, after reload, and after deletion. Separate coverage proves legacy orphan cleanup.
5. Unit and browser coverage exercise malformed comma groupings and the invalid UI, announcement, balance, save, and export states.
6. The obsolete `public/_headers` file was removed. `staticwebapp.config.json` remains the single deployment policy source. The service-worker cache advanced from `v9` to `v10`, and every route displays build `repair-2`.

The existing visual system, sample, exports, extraction, privacy boundaries, legal pages, and free product scope were preserved. `.factory/brief.json` is absent; `.factory/design.md` remains the visual source of truth.

## Exact regression evidence

- `npm run test:unit`: PASS — 4/4. This includes five malformed grouping cases and two valid grouped-value cases.
- `npx playwright test --grep 'attachment-boundary|delete-slip-data|removes attachment orphans|malformed comma grouping'`: PASS — 8/8 across desktop Chromium and the configured Pixel 5/390px project.
- `@claim:attachment-boundary`: proves attachment-first `{slips: 1, attachments: 1}`, reload retention, valid image/PDF replacement, exact 10,000,000-byte acceptance, and 10,000,001-byte rejection.
- `@claim:delete-slip-data`: proves attachment-first reload and final `{slips: 0, attachments: 0}` after confirmed deletion.
- `removes attachment orphans left by the previous release`: seeds `{slips: 0, attachments: 1}` and proves startup repairs it to `{slips: 0, attachments: 0}`.
- `rejects malformed comma grouping before balance, saving, and export`: proves `aria-invalid=true`, `Fix invalid amount`, announced correction text, and blocked save/export for `1,2,3`.

## Complete local verification

Run from the repository root:

```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm audit --audit-level=low
```

Results:

- Clean install: PASS — 61 packages, 0 vulnerabilities.
- `npm test`: PASS — 4/4 Vitest and 56/56 Playwright tests with one worker.
- Every one of the 14 exact `.factory/claims.json` commands: PASS independently — 28/28 desktop/mobile runs.
- Typecheck: PASS. No separate lint command or lint configuration exists.
- Production build: PASS; `dist/index.html` exists and `dist/_headers` does not.
- Output budgets: JavaScript 43,317 B raw / 13.25 kB gzip; CSS 19,879 B raw / 5.03 kB gzip; hero WebP 58,066 B; no web fonts.
- Browser/keyboard/mobile: PASS in the committed Playwright suite. It covers the complete job, 390px layout and 44px targets, Enter/Space disclosure operation, route focus, dialogs, validation focus, undo, and reduced-motion behavior.
- Accessibility: PASS — Playwright Axe reports zero serious/critical WCAG 2 A/AA violations across app, demo, Privacy, Terms, offline, static 404, unknown 404, and dialog states on both projects.
- Privacy/response policy: PASS — the complete demo and manual flows assert no unlisted cross-origin request; optional extraction is explicit and fixture-backed. Static policy/cache assertions pass.
- Offline/install/update: PASS — service-worker controlled offline reload, retained edits, manifest/icons/installability, `v10` cache, `skipWaiting`, and the existing update-ready prompt path are intact.
- Factory URL smoke check against the production build: PASS — 714 ms network-idle load, no console/page errors, title, `lang=en`, one h1/main, no missing alt, and no unlabeled buttons.
- Lighthouse 12.5.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.90 s, LCP 1.43 s, TBT 0 ms, CLS 0.00050, Speed Index 0.90 s.
- Visual inspection: desktop and 390px screenshots retain the broadsheet hierarchy, warm-paper palette, orange action grammar, legible stacked controls, and no horizontal overflow.

Evidence is in `.factory/evidence/repair-2/`: `local/verify.json`, desktop/mobile screenshots, and `lighthouse-local.json`.

## Deployment and live identity

Deployment and post-deploy identity evidence will be appended immediately after the committed `dist/` artifact is uploaded through `/opt/fleet/lib/deploy-static.sh split-pass-through-costs dist`.

## Known gaps

- The researched brief file is not present in this checkout. Existing records describe one-time monetization, but the shipped utility deliberately remains fully free because the earlier checkout endpoint was unavailable. No dead purchase path was restored.
- This static PWA has no product-owned API, package consumer, sign-in, billing call, or health endpoint. Backend concurrency, rate-limit, Entra identity, package-consumer, and server response-policy tests are not applicable.
- Optional real Sociobot extraction was not charged during automated tests. Its request shape uses recorded/intercepted fixtures; manual entry and the demo work without it.

## Next step

Independent verification should rerun the two exact reproductions from `.factory/verification-3.md`, all registered claims, and live artifact hashes after deployment.
