import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0032 - Search with no matches shows an empty state message
 * (suite: search)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront: a role="search"
 * form with a labelled search box and a "Search" button; the results area is
 * data-testid="search-results", product tiles are data-testid="search-result",
 * and the empty-state message is data-testid="search-empty".
 */
test('Search with no matches shows an empty state message', async ({ page }) => {
  // Surface any client-side error so the "no error is raised" expectation is real.
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // --- Step 1: enter a term that matches no product ---
  // Expected: the results area renders with no product tiles.
  await page.goto('/search');
  await page.getByLabel(/search products/i).fill('zzzzz'); // fallback: getByTestId('search-input')
  await page.getByRole('button', { name: /search/i }).click(); // fallback: getByTestId('search-submit')

  const results = page.getByTestId('search-results');
  await expect(results).toBeVisible();
  await expect(page.getByTestId('search-result')).toHaveCount(0);

  // --- Step 2: read the results area ---
  // Expected: the friendly empty-state message is shown; no error is raised.
  await expect(page.getByTestId('search-empty')).toHaveText('No products match your search.');
  expect(pageErrors).toEqual([]);
});
