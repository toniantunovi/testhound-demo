---
id: TC-0014
title: Cart totals recalculate with tax
suite: checkout
section: payment
priority: critical
type: functional
status: active
owner: priya
tags:
- checkout
- p1
- tax
automation:
  state: linked
  specs:
  - tests/checkout/cart-totals-recalculate-with-tax.spec.ts
  last_synced: 2026-07-05T10:22:00Z
  source_hash: bca669
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Add items and enter a taxable address
   - **Expected:** Subtotal, tax, and total are correct
