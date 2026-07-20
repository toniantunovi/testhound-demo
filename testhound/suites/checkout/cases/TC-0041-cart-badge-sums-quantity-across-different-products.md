---
id: TC-0041
title: Cart badge sums quantity across different products
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
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront with an empty cart

## Steps
1. Add one product to the cart
   - **Expected:** The cart badge shows 1
2. Add a different product to the cart
   - **Expected:** The cart badge shows 2
3. Open the cart
   - **Expected:** Both products appear as separate line items, each with quantity 1
