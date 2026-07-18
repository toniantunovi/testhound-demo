---
id: TC-0002
title: Login with invalid credentials shows an error
suite: auth
priority: high
type: negative
status: active
owner: marco
tags:
- auth
- negative
automation:
  state: none
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Submit a wrong password
   - **Expected:** An inline error is shown and no session is created
