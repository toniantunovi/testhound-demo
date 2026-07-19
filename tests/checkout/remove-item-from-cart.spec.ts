import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0008 - Remove item from cart (suite: checkout / cart)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront; data-testid
 * hooks (cart-remove, cart-item, cart-empty, cart-badge) back up the role
 * selectors used below.
 */
test('Remove item from cart', async ({ page }) => {
  // Setup for the precondition ("cart with one item"): add a single product.
  await page.goto('/product/blue-mug');
  await page.getByRole('button', { name: /add to cart/i }).click();

  // --- Step 1: Open the cart with one item ---
  // Expected: the item row shows a remove control.
  await page.goto('/cart');
  const row = page.getByTestId('cart-item');
  await expect(row).toHaveCount(1);
  const removeButton = page.getByRole('button', { name: /remove/i }); // fallback: getByTestId('cart-remove')
  await expect(removeButton).toBeVisible();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');

  // --- Step 2: Click remove ---
  // Expected: the row disappears and the cart badge decrements.
  await removeButton.click();
  await expect(page.getByTestId('cart-item')).toHaveCount(0);
  await expect(page.getByTestId('cart-empty')).toBeVisible();
  await expect(page.getByTestId('cart-badge')).toHaveText('0');
});
