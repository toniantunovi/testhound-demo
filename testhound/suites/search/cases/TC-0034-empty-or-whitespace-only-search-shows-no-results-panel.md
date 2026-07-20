---
id: TC-0034
title: Empty or whitespace only search shows no results panel
suite: search
priority: low
type: negative
status: active
owner: lena
tags:
- search
- edge-case
automation:
  state: linked
  specs:
  - tests/search/empty-or-whitespace-only-search-shows-no-results-panel.spec.ts
  last_synced: 2026-07-20T21:05:48Z
  source_hash: e716f6
  generator: claude-code
created: 2026-07-19T00:00:00Z
updated: 2026-07-20T21:05:48Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the Search page and submit with an empty query
   - **Expected:** Page returns 200; no results list and no empty-state message are rendered
2. Submit a query of only whitespace, e.g. "   "
   - **Expected:** The query is trimmed; behavior matches an empty query (no results panel), and the reflected input value is blank rather than showing the spaces
