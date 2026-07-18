---
id: TC-0009
title: Increment quantity when re-adding an item
suite: checkout
section: cart
priority: high
type: functional
status: active
owner: priya
tags:
- cart
- p1
automation:
  state: linked
  specs:
  - tests/checkout/increment-quantity-when-re-adding-an-item.spec.ts
  last_synced: 2026-07-05T10:22:00Z
  source_hash: d1a9e3
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Add "Blue Mug" to the cart twice
   - **Expected:** Quantity shows 2 rather than two rows
