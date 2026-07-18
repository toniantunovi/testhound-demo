---
id: TC-0021
title: Search returns relevant products
suite: search
priority: high
type: functional
status: active
owner: lena
tags:
- search
- p1
automation:
  state: linked
  specs:
  - tests/search/search-returns-relevant-products.spec.ts
  last_synced: 2026-07-05T10:22:00Z
  source_hash: 1e4644
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Search for "mug"
   - **Expected:** Results contain products whose title matches
