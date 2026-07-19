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
  state: linked
  specs:
  - tests/auth/login-with-invalid-credentials-shows-an-error.spec.ts
  last_synced: 2026-07-19T17:00:54Z
  source_hash: a1af74
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-19T17:00:54Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Submit a wrong password
   - **Expected:** An inline error is shown and no session is created
