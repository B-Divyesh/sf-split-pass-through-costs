# Copy audit — repair 2

Counts treat hyphenated terms as one word. Landing, demo, legal, and README copy has no sentence over 22 words and no banned marketing terms. Claims in the Result column are registered in `.factory/claims.json`.

## Landing and demo

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | For contractors billing materials | Audience label |
| 8 | Split one bill into billable and overhead costs. | Job headline |
| 12 | For contractors who need to separate client costs from their own overhead. | Audience statement |
| 7 | The sample opens a completed supplier bill. | `demo-isolation` |
| 5 | Your real bill starts empty. | Plain instruction |
| 4 | Saved in this browser | `slip-persistence` |
| 6 | Works offline after the first visit | `offline-reload` |
| 5 | Saving and exports are free | `free-core` |
| 3 | One supplier bill. | Caption |
| 4 | Billable costs and overhead. | Caption |
| 7 | Split one supplier bill in three steps. | How-it-works heading |
| 7 | Add the supplier total and optional attachment. | `attachment-boundary` |
| 7 | Mark every cost row billable or overhead. | `split-export` |
| 11 | Save a CSV or a client line list when it balances. | `split-export`, `client-output` |
| 7 | Your first balanced bill will appear here. | Empty-state instruction |
| 7 | Backup files contain slip details, not attachments. | `backup-omits-attachments` |
| 4 | Required fields are marked *. | Form instruction |
| 4 | Use two decimal places. | Form instruction |
| 9 | Include tax if it is on the supplier bill. | Form instruction |
| 12 | Images and PDFs up to 10 MB are saved in this browser. | `attachment-boundary` |
| 6 | Optional: extraction uses your Sociobot key. | `bill-extraction` |
| 5 | Manual entry still works offline. | `offline-reload` |
| 11 | Billable means you plan to charge the client for that row. | Definition |
| 11 | Enter the bill total and cost rows to check the split. | Empty-state instruction |
| 13 | Each row keeps its supplier bill reference, category, and billable or overhead choice. | `split-export` |
| 8 | Check your bookkeeping and tax treatment before importing. | Guidance |
| 10 | Split Cost Slip does not give tax or accounting advice. | Limitation |
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 11 | Keep original attachments and check every export before accounting or invoicing. | Guidance |
| 11 | Split Cost Slip separates one bill into billable costs and overhead. | Footer one-liner |
| 6 | Demo — sample data, nothing is saved | Required demo banner |
| 6 | Sample records use separate browser storage. | `demo-isolation` |
| 2 | Completed sample | Demo label |
| 3 | Supplier bill total | Demo label |
| 6 | Two billable rows · one overhead row | Demo state |
| 3 | Sunrise Building Supply | Seeded supplier bill |
| 2 | Balanced exactly | `cent-balance` |

## README and legal claims

| Words | Copy | Result |
| ---: | --- | --- |
| 9 | Split one supplier bill into billable costs and overhead. | Job summary |
| 14 | It is for contractors who need to separate client costs from their own overhead. | Audience statement |
| 9 | Attach the supplier bill and enter each cost row. | Workflow |
| 6 | Mark each row billable or overhead. | `split-export` |
| 7 | Export a CSV or client line list. | `split-export`, `client-output` |
| 15 | CSV keeps each row's supplier bill reference, category, amount, currency, and billable or overhead choice. | `split-export` |
| 12 | Client line lists and printed client line lists include billable rows only. | `client-output` |
| 12 | Images and PDFs up to 10 MB are stored in this browser. | `attachment-boundary` |
| 8 | Saved slips and attachments stay in this browser. | `slip-persistence` |
| 9 | Exact cent totals show balanced, under, and over states. | `cent-balance` |
| 9 | JSON backups export saved slip details without attachment files. | `backup-omits-attachments` |
| 10 | A separate sample demo never reads or writes real slips. | `demo-isolation` |
| 10 | Install Split Cost Slip as an app in supported browsers. | `installable-app` |
| 7 | It works offline after the first visit. | `offline-reload` |
| 5 | Saving and exports are free. | `free-core` |
| 13 | Optional extraction sends the named attachment to Sociobot only after you start it. | `bill-extraction` |
| 10 | It uses your Sociobot key and returns editable bill details. | `bill-extraction` |
| 9 | You choose billable or overhead for every suggested line. | `bill-extraction` |
| 5 | Manual entry remains available offline. | `offline-reload` |
| 8 | The demo sends no requests to other websites. | `local-privacy` |
| 10 | Manual bill entry, storage, and exports stay in this browser. | `manual-data-privacy` |
| 14 | Extraction sends the named attachment to api.sociobot.in only after you start it. | `bill-extraction` |
| 8 | Your key remains removable from the extraction panel. | `bill-extraction` |
| 9 | Backup files omit attachments, so keep original attachments separately. | `backup-omits-attachments` |
| 20 | Manual bill entry, storage, and exports stay in this browser. Split Cost Slip does not receive or sync that data. | `manual-data-privacy` |
| 18 | If you choose Extract bill details, the named attachment goes directly to the Sociobot gateway with your key. | `bill-extraction` |
| 19 | You see the file name before sending. The gateway returns editable bill details. It never chooses billable or overhead. | `bill-extraction` |
| 15 | Your Sociobot key stays in this browser until you remove it from the extraction panel. | `bill-extraction` |
| 11 | When a split balances, export a CSV or client line list. | `split-export`, `client-output` |
| 7 | Delete a slip to remove its attachment. | `delete-slip-data` |

## Terminology table

| Concept | Product term |
| --- | --- |
| Original expense record | supplier bill |
| Uploaded file | attachment |
| Client-ready output | client line list |
| Individual allocation | cost row |
| Chargeable treatment | billable |
| Internal treatment | overhead |

Product copy uses the terms above consistently.

## Error route

| Words | Copy | Result |
| ---: | --- | --- |
| 3 | Page not found | Literal route label |
| 5 | We cannot find this page. | Literal error heading |
| 9 | Check the address, return home, or open the sample. | Clear recovery instruction |

The catalog description is a 12-word, verb-first sentence under 120 characters.
