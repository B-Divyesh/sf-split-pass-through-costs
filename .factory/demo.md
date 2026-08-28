# Demo sandbox

Open <https://split-pass-through-costs.sociobot.in/demo> or use `?demo=1`. The first view is a completed Sunrise Building Supply bill for a Juniper Kitchen Remodel: $1,287.50 split across two billable material rows and one overhead delivery row.

Demo records use the separate IndexedDB database `split-cost-slip:demo` (documented in the UI as `demo:split-cost-slip`). Real records use `split-cost-slip`; the two databases are never read together. The persistent banner labels the mode, `Reset demo` deletes and reseeds only the demo database, and `Start for real` opens an empty real workspace.
