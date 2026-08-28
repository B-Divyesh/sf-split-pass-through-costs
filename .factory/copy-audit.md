# Copy audit — polish 2

Counts treat hyphenated words as one word. Landing and demo language has no sentence over 22 words and no banned marketing terms.

| Words | Copy | Result |
| ---: | --- | --- |
| 8 | Split one bill into billable and overhead costs. | Claim: split-export |
| 12 | For contractors who need to separate client costs from their own overhead. | Plain audience statement |
| 7 | The sample opens a completed supplier bill. | Claim: demo-isolation |
| 5 | Your real bill starts empty. | Plain instruction |
| 4 | Saved in this browser | Claim: slip-persistence |
| 6 | Works offline after the first visit | Claim: offline-reload |
| 5 | Saving and exports are free | Claim: free-core |
| 7 | Split one supplier bill in three steps. | Plain heading |
| 8 | Add the supplier total and optional attachment. | Plain instruction |
| 11 | Save a CSV or a client line list when it balances. | Claims: split-export, client-output |
| 13 | Each row keeps its supplier bill reference, category, and billable or overhead choice. | Claim: split-export |
| 6 | The demo sends no outside requests. | Claim: local-privacy |
| 9 | Keep supplier bill files and check every export before accounting or invoicing. | Guidance, not a product promise |
| 6 | Demo — sample data, nothing is saved | Required demo banner |
| 6 | Sample records use separate browser storage. | Claim: demo-isolation |
| 3 | Sample slips 1 | Demo state label |
| 2 | Sample record | Demo state label |
| 5 | Sunrise Building Supply | Seeded sample data |
| 2 | Balanced exactly | Claim: cent-balance |

## Terminology table

| Concept | Product term |
| --- | --- |
| Original expense record | supplier bill |
| Uploaded file | attachment |
| Client-ready output | client line list |
| Individual allocation | cost row |
| Chargeable treatment | billable |
| Internal treatment | overhead |

README and legal routes use the same terms. All visitor-facing product promises above are mapped in `.factory/claims.json`.
