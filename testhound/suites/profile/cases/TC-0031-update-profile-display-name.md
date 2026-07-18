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
  state: drifted
  specs:
  - tests/profile/update-profile-display-name.spec.ts
  last_synced: 2026-07-01T08:00:00Z
  source_hash: '000000'
  generator: claude-code
created: 2026-06-01T09:00:00Z
updated: 2026-07-05T10:22:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Change the display name and save
   - **Expected:** The new name appears in the header
