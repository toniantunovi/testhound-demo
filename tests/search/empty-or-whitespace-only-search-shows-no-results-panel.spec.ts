import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0034 - Empty or whitespace only search shows no results panel
 * (suite: search)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront (same conventions
 * as the sibling search specs): a role="search" form with a labelled search box
 * and a "Search" button; the results panel is data-testid="search-results",
 * product tiles are data-testid="search-result", the empty-state message is
 * data-testid="search-empty", and the input is data-testid="search-input".
 *
 * Key behaviour: the server trims the query, so an empty OR whitespace-only
 * query renders the form only, with no results panel and no empty-state message
 * (the empty-state message is reserved for a real query that matched nothing).
 */
test('Empty or whitespace only search shows no results panel', async ({ page }) => {
  const searchBox = () => page.getByLabel(/search products/i); // fallback: getByTestId('search-input')
  const submit = () => page.getByRole('button', { name: /search/i }); // fallback: getByTestId('search-submit')

  // --- Step 1: open the Search page and submit an empty query ---
  // Expected: page returns 200; no results list and no empty-state message.
  const response = await page.goto('/search');
  expect(response?.status()).toBe(200);

  await searchBox().fill('');
  await submit().click();
  await expect(page).toHaveURL(/\/search\?q=$/);

  // The results panel only renders for a non-blank query: it, the tiles, and
  // the empty-state message are all absent for an empty query.
  await expect(page.getByTestId('search-results')).toHaveCount(0);
  await expect(page.getByTestId('search-result')).toHaveCount(0);
  await expect(page.getByTestId('search-empty')).toHaveCount(0);

  // --- Step 2: submit a query of only whitespace, e.g. "   " ---
  // Expected: the query is trimmed; behaviour matches an empty query (no
  // results panel), and the reflected input value is blank, not the spaces.
  await page.goto('/search');
  await searchBox().fill('   ');
  await submit().click();

  // The whitespace is sent to the server (q=+++) but treated as empty...
  await expect(page).toHaveURL(/\/search\?q=(\+|%20|\s)+$/);
  await expect(page.getByTestId('search-results')).toHaveCount(0);
  await expect(page.getByTestId('search-result')).toHaveCount(0);
  await expect(page.getByTestId('search-empty')).toHaveCount(0);

  // ...and the reflected input value is blank rather than the submitted spaces.
  await expect(searchBox()).toHaveValue('');
});
