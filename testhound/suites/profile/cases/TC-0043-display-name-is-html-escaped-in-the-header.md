---
id: TC-0043
title: Display name is HTML-escaped in the header
suite: profile
priority: high
type: negative
status: active
owner: lena
tags:
- profile
- security
- xss
automation:
  state: none
created: 2026-07-20T10:00:00Z
updated: 2026-07-20T10:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open Profile and save a display name containing markup, e.g. `<img src=x onerror=window.__pwned=1><script>window.__pwned=1</script>`
   - **Expected:** The page loads normally; no JavaScript dialog appears and no injected script runs
2. Inspect the greeting rendered in the header
   - **Expected:** The name is shown as escaped, literal text; no `<img>` or `<script>` element is created in the DOM
