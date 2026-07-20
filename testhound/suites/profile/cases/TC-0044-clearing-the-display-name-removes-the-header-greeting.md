---
id: TC-0044
title: Clearing the display name removes the header greeting
suite: profile
priority: low
type: functional
status: active
owner: priya
tags:
- profile
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront with a saved display name shown in the header

## Steps
1. Open Profile, clear the display name field, and save
   - **Expected:** The profile saves successfully
2. Inspect the header
   - **Expected:** The "Hi, ..." greeting is no longer shown
