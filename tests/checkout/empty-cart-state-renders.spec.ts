import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0011 - Empty cart state renders (suite: checkout / cart)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront; data-testid
 * hooks (cart-empty, browse-products) back up the role/text selectors.
 */
test('Empty cart state renders', async ({ page }) => {
  // --- Step 1: Open the cart with no items ---
  // Expected: an empty-state message and a "Browse products" link are shown.
  await page.goto('/cart');

  const empty = page.getByTestId('cart-empty');
  await expect(empty).toBeVisible();
  await expect(empty).toContainText(/empty/i);

  const browse = page.getByRole('link', { name: /browse products/i }); // fallback: getByTestId('browse-products')
  await expect(browse).toBeVisible();
  await expect(page.getByTestId('cart-item')).toHaveCount(0);
});
