---
id: TC-0035
title: Search matches product titles only not descriptions or ids
suite: search
priority: medium
type: functional
status: draft
owner: lena
tags:
  - search
  - coverage-gap
  - likely-bug
created: 2026-07-19T00:00:00Z
updated: 2026-07-19T00:00:00Z
---

## Preconditions
- User is on the Acme Shop storefront
- Known products: Blue Mug, Red Mug, Travel Mug, Notebook, Gel Pen

## Steps
1. Search for a word that appears only in a product description, e.g. "ceramic" (Blue Mug blurb) or "insulated" (Travel Mug blurb)
   - **Expected (current behavior):** No results are returned, because search only matches the product title
2. Search for a product id/handle, e.g. "blue-mug"
   - **Expected (current behavior):** No results are returned; ids are not indexed for search

## Notes
Likely bug / discoverability gap. `searchPage` in `app/server.js` filters on
`p.title` only (`title.toLowerCase().includes(q)`), so intent-based queries that
users reasonably expect to work ("ceramic", "insulated", "stainless", a product
handle) return the empty state. This case is filed as `draft` to capture the
current behavior and flag the gap; if product owners decide search should cover
descriptions/ids, update the expected results to assert matches and promote to
`active`.
