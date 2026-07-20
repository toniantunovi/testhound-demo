---
id: TC-0039
title: Unknown product id returns a 404
suite: products
priority: medium
type: negative
status: active
owner: lena
tags:
- products
- negative
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Navigate to a product detail URL for an id that does not exist, e.g. `/product/does-not-exist`
   - **Expected:** The response is a 404 and a "No such product" message is shown
2. Confirm no add-to-cart control is present
   - **Expected:** The page offers no way to add the missing product to the cart
