import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0007 - Add item to cart from product page (suite: checkout / cart)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors were confirmed by driving the running storefront:
 * data-testid hooks (product-add-to-cart, cart-badge, toast, cart-item*) back
 * up the role/text selectors used below.
 */
test('Add item to cart from product page', async ({ page }) => {
  // --- Step 1: Open the product page for "Blue Mug" ---
  // Expected: product details and an "Add to cart" button are visible.
  await page.goto('/product/blue-mug');
  await expect(page.getByTestId('product-title')).toHaveText('Blue Mug');
  await expect(page.getByTestId('product-price')).toHaveText('$12.00');
  const addToCart = page.getByRole('button', { name: /add to cart/i }); // fallback: getByTestId('product-add-to-cart')
  await expect(addToCart).toBeVisible();

  // --- Step 2: Click "Add to cart" ---
  // Expected: cart badge increments to 1; toast "Added to cart" appears.
  await addToCart.click();
  await expect(page.getByRole('status')).toHaveText(/added to cart/i); // fallback: getByTestId('toast')
  await expect(page.getByTestId('cart-badge')).toHaveText('1');

  // --- Step 3: Open the cart ---
  // Expected: "Blue Mug" is listed with quantity 1 and correct price.
  await page.getByTestId('cart-link').click();
  const row = page.getByTestId('cart-item');
  await expect(row).toHaveCount(1);
  await expect(row.getByTestId('cart-item-title')).toHaveText('Blue Mug');
  await expect(row.getByTestId('cart-item-qty')).toHaveText('1');
  await expect(row.getByTestId('cart-item-price')).toHaveText('$12.00');
});
