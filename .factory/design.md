# Split Cost Slip — visual thesis

## Direction: the job-cost broadsheet

Split Cost Slip looks like a supplier invoice spread across a contractor's workbench, then annotated with the decisiveness of a newspaper copy desk. It is a **monochrome typographic broadsheet**, not accounting-software chrome: oversized condensed headlines, narrow rules, tabular figures, margin notes, and one safety-orange mark for the next physical action. This fits the job because the source bill remains visually primary while the split becomes a legible editorial correction rather than a duplicate transaction.

The treatment is intentionally single-mode. Warm paper and carbon ink are part of the product metaphor; explicit surfaces and strong contrast make it comfortable in daylight, workshops, and installed-app use. There is no decorative dark theme.

## Tokens

- `paper #F2EFE6`: page/background, inspired by uncoated invoice stock.
- `sheet #FFFDF7`: elevated working sheet.
- `ink #171713`: primary type and rules (15.9:1 on paper).
- `ink-soft #59584F`: secondary copy (6.3:1 on paper).
- `signal #C63D18`: safety-orange action/selection (5.2:1 with white, 4.8:1 on paper for large/UI marks).
- `signal-dark #8E270D`: hover and text accent.
- `success #21633C`, `warning #865B00`, `danger #A52A20`: always paired with words or symbols.
- Rules use `ink` at 18–28% opacity only when they are not the sole boundary; focus uses a 3px `signal` outline plus 2px paper offset.

## Typography

- Display: **Arial Narrow**, `Liberation Sans Narrow`, `Nimbus Sans Narrow`, sans-serif. Tall, condensed headlines evoke trade broadsheets without a font download.
- Working text: **Georgia**, `Times New Roman`, serif for readable invoice detail.
- UI labels and numerals: `Arial`, `Helvetica Neue`, sans-serif with tabular figures. No third-party fonts or runtime font requests.
- Scale: 14 label / 16 body / 20 section / 32 deck / clamp(48–88) masthead. Body line-height 1.55 and readable measure 68ch.

## Layout and spacing

The 4/8px rhythm uses 4, 8, 12, 16, 24, 32, 48, 64, and 96px. Desktop is an asymmetric 12-column newspaper grid: source details and rows occupy eight columns; totals and actions occupy four. At 390px the folio strip simplifies, the grid becomes one column, row fields stack in task order, and totals remain in document flow—never a fixed bar that obscures content. Touch targets are at least 44px and controls have 8px separation.

Cards are reserved for independent saved slips. The active document is one continuous sheet divided by typographic rules. Corners are nearly square (0–4px); shadows resemble a page lifted from a bench, not floating app tiles.

## Interaction grammar

- **Mark:** orange underline/circle means selected or actionable.
- **Rule:** a heavy black rule closes a section or confirms a balanced total.
- **Margin note:** status, privacy, and validation appear beside the affected material in small sans-serif type.
- **Tear-off:** CSV, client line list, and backup exports sit together as detachable outputs.
- Billable is a real labelled switch with `Billable` / `Overhead` words; color is supplemental.
- Destructive actions name the object and require confirmation. Row deletion is reversible through an undo notice.

## Motion

Only state changes move. A new allocation row enters 12px from its source over 180ms; notices rise 8px over 200ms; balance numerals cross-fade over 150ms. No looping animation. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and all state changes are instant opacity swaps.

## Original asset plan and provenance

The hero is a generated, text-free overhead editorial still life of one creased supplier invoice physically divided into dark and orange paper strips, with ruler, pencil, and carbon marks. It explains “one source, two destinations” without pretending to perform OCR. PWA icons are hand-authored geometric SVG-derived marks: a receipt split by an orange rule. No stock imagery, logos, people, or copyrighted characters.

### Generation prompt sheet

- Use case: stylized-concept
- Asset: wide PWA landing/workspace masthead illustration
- Subject/world: overhead contractor workbench; one blank, creased supplier invoice; hand-cut black and safety-orange allocation strips; steel ruler; carpenter pencil; restrained carbon tally marks
- Medium/materials: tactile monochrome editorial still life, uncoated paper, newsprint halftone grain, cut-paper collage realism
- Light/lens: diffuse north-window light, top-down 50mm equivalent, crisp document edges, modest natural shadows
- Palette words: warm invoice paper, carbon black, graphite gray, one safety-orange accent
- Composition: landscape, main paper anchored right, generous clean paper space left, no interface mockup
- Negative list: no readable text, no numbers, no logos, no watermark, no people/hands, no currency symbols, no screens, no gradients, no blue, no glossy 3D

Generated with the factory image model (`factory-image`, Azure AI Foundry) on 2026-08-28. The selected output is original project artwork under the repository's MIT license. Source PNG and exact prompt sidecar are retained in `assets/src/`; optimized WebP is shipped in `public/assets/`. The footer discloses AI-generated artwork.

## Accessibility and image behavior

The artwork is explanatory and has concise alt text; it never carries instructions or required data. The page has one `h1`, semantic landmarks, skip navigation, designed focus states, 16px minimum body copy, text alternatives for state, and print styling that removes controls. Images declare width/height; the responsive hero loads as WebP under 300KB with high fetch priority.
