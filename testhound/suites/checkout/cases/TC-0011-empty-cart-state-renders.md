---
id: TC-0011
title: Empty cart state renders
suite: checkout
section: cart
priority: low
type: functional
status: active
owner: priya
tags:
- cart
automation:
  state: linked
  specs:
  - tests/checkout/empty-cart-state-renders.spec.ts
  last_synced: 2026-07-05T10:22:00Z
  source_hash: 92130b
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the cart with no items
   - **Expected:** An empty-state message and a "Browse products" link are shown
