# Polish 1 — finding disposition

Candidate repaired from cc621feee496c7aa11ffc9e5696ef8cfdc81e25d. Evidence names refer to tests/app.spec.ts. Claim commands are in .factory/claims.json.

| Finding id | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced first screen with the job, contractor audience, sample and real actions above the fold. | Desktop/mobile screenshot; route test |
| F-1-2 | Added isolated demo route/query, Sunrise sample, banner, reset, start-real discard, and docs. | @claim:demo-isolation |
| F-1-3 | Added registry and one tagged test for every retained claim. | all claim commands |
| F-1-4 | Replaced broad storage promise with tested no-cross-origin demo flow. | @claim:local-privacy |
| F-1-5 | Balanced CSV export blocks invalid or unbalanced values. | split-export; invalid-money regression |
| F-1-6 | Attachment metadata persists even for an otherwise empty slip. | attachment-boundary |
| F-1-7 | Exact 10,000,000/10,000,001-byte boundary is tested. | attachment-boundary |
| F-1-8 | CSV retains source/category/type and blocks invalid export. | split-export |
| F-1-9 | Removed five-slip limit and claim. | free-core test |
| F-1-10 | Removed unavailable price and checkout copy. | link crawl |
| F-1-11 | Removed Pro and untestable license promise. | source inspection |
| F-1-12 | Kept core tools free with a narrow testable claim. | free-core |
| F-1-13 | Removed footer provenance marketing claim. | copy audit |
| F-1-14 | Narrowed privacy language and tested seeded flow. | local-privacy |
| F-1-15 | Removed checkout wording and dead link. | link crawl |
| F-1-16 | Removed unsupported merchant/refund statement. | copy audit |
| F-1-17 | Rewrote README opening in plain contractor language. | copy audit |
| F-1-18 | README describes tested split/export flow. | split-export |
| F-1-19 | Invalid decimals announce an error and block save/export. | invalid-money regression |
| F-1-20 | Row type/category behavior is asserted in seeded CSV. | split-export |
| F-1-21 | Fixed first-input attachment persistence and boundary. | attachment-boundary |
| F-1-22 | Removed capped/Pro archive claims. | copy audit |
| F-1-23 | Import validates all fields before one atomic transaction. | malformed-import regression |
| F-1-24 | Offline behavior is tested; mobile targets are 44px. | offline-reload; axe mobile |
| F-1-25 | Removed unavailable one-time license claim. | source inspection |
| F-1-26 | Rebuilt legal routes with metadata, chrome, and axe coverage. | route/axe test |
| F-1-27 | Documented separate real/demo storage namespaces. | demo-isolation |
| F-1-28 | README now states actual suite scope. | npm test |
| F-1-29 | Build instruction is developer documentation and build is verified. | npm run build |
| F-1-30 | Slip/attachment association persists through reload. | attachment-boundary |
| F-1-31 | Privacy claim is network-interception tested. | local-privacy |
| F-1-32 | Removed optional license request and daily-cache claim. | source inspection |
| F-1-33 | Backup omission is documented without a marketing claim. | export implementation |
| F-1-34 | Invalid money cannot appear balanced or export stale cents. | invalid-money regression |
| F-1-35 | Strict schema validation prevents poisoned startup. | malformed-import regression |
| F-1-36 | Removed purchase calls until product registration exists. | source/link crawl |
| F-1-37 | Attachment-only records are saved, not orphaned. | attachment-boundary |
| F-1-38 | Legal eyebrow contrast is safe; every route runs axe. | axe route test |
| F-1-39 | Added SWA CSP, anti-framing, nosniff, and referrer headers. | deployed header check |
| F-1-40 | Added immutable asset and no-cache worker policies. | deployed header check |
| F-1-41 | Footer links have 44px boxes. | mobile screenshot |
| F-1-42 | Wordmark name includes visible S/ Split Cost Slip. | axe route test |
| F-1-43 | Added designed app/static 404 and SWA response override. | route/deployed URL |
| F-1-44 | Added route titles/canonical/OG/Twitter/icons/1200×630 crop. | metadata inspection |
| F-1-45 | Added shared navigation/footer, sitemap, build id, SWA config. | route/link crawl |
| F-1-46 | Headings are focusable/announced in app; legal pages expose live regions. | keyboard smoke |
| F-1-47 | Added three facts, three steps, and limits section. | screenshot |
| F-1-48 | Replaced slogan with plain job headline. | copy audit |
| F-1-49 | Replaced internal eyebrow with contractor audience. | copy audit |
| F-1-50 | Renamed source section to Enter the supplier bill. | copy audit |
| F-1-51 | Renamed rows section to Divide the bill into cost rows. | copy audit |
| F-1-52 | Renamed totals section to Match the split to the bill total. | copy audit |
| F-1-53 | Renamed output section to Export the finished split. | copy audit |
| F-1-54 | Removed unneeded paid section. | source inspection |
| F-1-55 | Primary action is Try it with sample data. | screenshot |
| F-1-56 | New-slip action is Create a new slip. | keyboard smoke |
| F-1-57 | Removed paid-details action. | source inspection |
| F-1-58 | Removed license restore action. | source inspection |
| F-1-59 | Removed dead Buy Pro action. | link crawl |
| F-1-60 | Standardized supplier bill, cost row, billable, overhead, saved slips. | copy audit |
| F-1-61 | Rewrote README opener below 22 words. | copy audit |
| F-1-62 | Split README instructions into short sentences. | copy audit |
| F-1-63 | Rewrote README test description below 22 words. | copy audit |
| F-1-64 | Removed implementation/accounting jargon from introduction. | copy audit |
