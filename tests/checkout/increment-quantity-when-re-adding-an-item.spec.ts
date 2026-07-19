import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0009 - Increment quantity when re-adding an item (suite: checkout / cart)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront.
 */
test('Increment quantity when re-adding an item', async ({ page }) => {
  // --- Step 1: Add "Blue Mug" to the cart twice ---
  // Expected: quantity shows 2 rather than two rows.
  for (let i = 0; i < 2; i++) {
    await page.goto('/product/blue-mug');
    await page.getByRole('button', { name: /add to cart/i }).click(); // fallback: getByTestId('product-add-to-cart')
  }

  await page.goto('/cart');
  const rows = page.getByTestId('cart-item');
  await expect(rows).toHaveCount(1); // a single row, not two
  await expect(rows.getByTestId('cart-item-qty')).toHaveText('2');
  await expect(page.getByTestId('cart-badge')).toHaveText('2');
});
