---
id: TC-0036
title: Unauthenticated dashboard access redirects to login
suite: auth
priority: high
type: negative
status: active
owner: marco
tags:
- auth
- security
- p1
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront and is not signed in

## Steps
1. Navigate directly to the dashboard URL without signing in
   - **Expected:** The request is redirected to the login page and the dashboard is not shown
2. Confirm the login form is displayed
   - **Expected:** Email and password fields are visible
