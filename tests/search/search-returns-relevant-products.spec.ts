import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0021 - Search returns relevant products (suite: search)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront: a role="search"
 * form with a labelled search box and a "Search" button, results rendered as
 * data-testid="search-result".
 */
test('Search returns relevant products', async ({ page }) => {
  // --- Step 1: Search for "mug" ---
  // Expected: results contain products whose title matches.
  await page.goto('/search');
  await page.getByLabel(/search products/i).fill('mug'); // fallback: getByTestId('search-input')
  await page.getByRole('button', { name: /search/i }).click(); // fallback: getByTestId('search-submit')

  const results = page.getByTestId('search-result');
  const count = await results.count();
  expect(count).toBeGreaterThan(0);

  // Every returned product's title matches the query...
  for (let i = 0; i < count; i++) {
    await expect(results.nth(i)).toContainText(/mug/i);
  }
  // ...and the canonical match is present.
  await expect(results.filter({ hasText: 'Blue Mug' })).toHaveCount(1);
});
