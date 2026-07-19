---
id: TC-0001
title: Login with valid credentials
suite: auth
priority: critical
type: smoke
status: active
owner: marco
tags:
- auth
- p1
- smoke
automation:
  state: linked
  specs:
  - tests/auth/login-with-valid-credentials.spec.ts
  last_synced: 2026-07-19T11:45:53Z
  source_hash: 2fd785
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-19T11:45:53Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the login page
   - **Expected:** Email and password fields are visible
2. Enter valid credentials and submit
   - **Expected:** User lands on the dashboard
