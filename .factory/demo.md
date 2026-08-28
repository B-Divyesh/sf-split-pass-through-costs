# Demo sandbox

Use <https://split-pass-through-costs.sociobot.in/?demo=1> for the one-click sample. The equivalent route <https://split-pass-through-costs.sociobot.in/demo> opens the same sandbox.

The first view shows a completed Sunrise Building Supply bill for the Juniper Kitchen Remodel. Its $1,287.50 total is split across two billable material rows and one overhead delivery row.

Demo records use the separate IndexedDB database `split-cost-slip:demo`. Real records use `split-cost-slip`. The app never opens both databases in one mode.

The banner says `Demo — sample data, nothing is saved`. `Reset demo` deletes and reseeds only the demo database. `Start for real` deletes the demo database and opens an empty real workspace.

The sample includes a local PDF placeholder. `Extract bill details` uses the recorded Sunrise result in demo mode and makes no gateway request.
