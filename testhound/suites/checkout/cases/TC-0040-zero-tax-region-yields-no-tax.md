---
id: TC-0040
title: Zero-tax region yields no tax
suite: checkout
section: payment
priority: high
type: functional
status: active
owner: priya
tags:
- checkout
- tax
- p1
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront with at least one item in the cart

## Steps
1. Open the cart and select the "Oregon (no sales tax)" region, then apply
   - **Expected:** Tax shows `$0.00` and the total equals the subtotal
2. Select the default "Select a region" option and apply
   - **Expected:** Tax remains `$0.00` and the total still equals the subtotal
