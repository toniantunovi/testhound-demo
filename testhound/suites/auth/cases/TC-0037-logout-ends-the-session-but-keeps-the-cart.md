---
id: TC-0037
title: Logout ends the session but keeps the cart
suite: auth
priority: high
type: functional
status: active
owner: marco
tags:
- auth
- cart
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is signed in to Acme Shop with at least one item in the cart

## Steps
1. Note the cart badge count, then log out
   - **Expected:** The user is returned to the login page
2. Navigate directly to the dashboard URL
   - **Expected:** The request is redirected to login; the dashboard is no longer accessible
3. Open the cart
   - **Expected:** The previously added item is still present and the cart badge count is unchanged
