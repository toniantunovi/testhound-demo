---
id: TC-0032
title: Search with no matches shows an empty state message
suite: search
priority: medium
type: functional
status: active
owner: lena
tags:
- search
- empty-state
automation:
  state: linked
  specs:
  - tests/search/search-with-no-matches-shows-an-empty-state-message.spec.ts
  last_synced: 2026-07-19T16:48:12Z
  source_hash: ca0113
  generator: claude-code
created: 2026-07-19T00:00:00Z
updated: 2026-07-19T16:48:12Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the Search page and enter a term that matches no product, e.g. "zzzzz"
   - **Expected:** The results area renders with no product tiles
2. Read the results area
   - **Expected:** A friendly message "No products match your search." is shown (data-testid="search-empty"); no error is raised
