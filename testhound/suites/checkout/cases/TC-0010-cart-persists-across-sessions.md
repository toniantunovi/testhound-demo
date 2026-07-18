---
id: TC-0010
title: Cart persists across sessions
suite: checkout
section: cart
priority: medium
type: e2e
status: active
owner: lena
tags:
- cart
automation:
  state: none
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Add an item, then sign out and back in
   - **Expected:** The cart still contains the item
