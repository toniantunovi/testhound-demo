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
  state: linked
  specs:
  - tests/checkout/remove-item-from-cart.spec.ts
  last_synced: 2026-07-19T12:46:50Z
  source_hash: c7e6d6
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-19T12:46:50Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the cart with one item
   - **Expected:** The item row shows a remove control
2. Click remove
   - **Expected:** The row disappears and the cart badge decrements
