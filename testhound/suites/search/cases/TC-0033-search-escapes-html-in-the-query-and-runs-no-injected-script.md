---
id: TC-0033
title: Search escapes HTML in the query and runs no injected script
suite: search
priority: high
type: negative
status: active
owner: lena
tags:
  - search
  - security
  - xss
created: 2026-07-19T00:00:00Z
updated: 2026-07-19T00:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront

## Steps
1. Open the Search page and submit a query containing markup, e.g. `<img src=x onerror=window.__pwned=1><script>window.__pwned=1</script>`
   - **Expected:** The page loads normally with a 200 response; no JavaScript dialog appears and no injected script runs
2. Submit a query of `<b>bold</b>` and inspect the reflected value in the search input
   - **Expected:** The query is reflected as escaped, literal text; no `<b>` element is created in the DOM (the input value shows the raw characters `<b>bold</b>`)
