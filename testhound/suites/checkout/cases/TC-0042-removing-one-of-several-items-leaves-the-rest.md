---
id: TC-0042
title: Removing one of several items leaves the rest
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
- User is on the Acme Shop storefront with two different products in the cart

## Steps
1. Open the cart
   - **Expected:** Two line items are shown, each with a remove control
2. Remove the first line item
   - **Expected:** That row disappears, the second item remains, and the cart badge decrements by that item's quantity
