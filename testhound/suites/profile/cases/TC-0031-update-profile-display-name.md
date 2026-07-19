---
id: TC-0031
title: Update profile display name
suite: profile
priority: medium
type: functional
status: active
owner: priya
tags:
- profile
automation:
  state: linked
  specs:
  - tests/profile/update-profile-display-name.spec.ts
  last_synced: 2026-07-19T12:19:59Z
  source_hash: f52a42
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-19T12:19:59Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Change the display name and save
   - **Expected:** The new name appears in the header
