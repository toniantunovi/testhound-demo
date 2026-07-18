---
id: TC-0008
title: Remove item from cart
suite: checkout
section: cart
priority: medium
type: functional
status: active
owner: marco
tags:
- cart
- checkout
automation:
  state: drifted
  specs:
  - tests/checkout/remove-item-from-cart.spec.ts
  last_synced: 2026-07-01T08:00:00Z
  source_hash: '000000'
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the cart with one item
   - **Expected:** The item row shows a remove control
2. Click remove
   - **Expected:** The row disappears and the cart badge decrements
