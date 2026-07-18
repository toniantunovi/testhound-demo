---
id: TC-0007
title: Add item to cart from product page
suite: checkout
section: cart
priority: high
type: functional
status: active
owner: priya
tags:
- cart
- p1
- checkout
automation:
  state: linked
  specs:
  - tests/checkout/add-item-to-cart-from-product-page.spec.ts
  last_synced: 2026-07-05T10:22:00Z
  source_hash: d13aa1
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the product page for "Blue Mug"
   - **Expected:** Product details and an "Add to cart" button are visible
2. Click "Add to cart"
   - **Expected:** Cart badge increments to 1; toast "Added to cart" appears
3. Open the cart
   - **Expected:** "Blue Mug" is listed with quantity 1 and correct price
