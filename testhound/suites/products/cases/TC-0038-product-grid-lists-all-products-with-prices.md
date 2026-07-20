---
id: TC-0038
title: Product grid lists all products with prices
suite: products
priority: medium
type: smoke
status: active
owner: priya
tags:
- products
- smoke
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the Products page
   - **Expected:** A grid of product tiles is shown, one per catalog product
2. Inspect each tile
   - **Expected:** Every tile shows a product title linking to its detail page and a formatted price
