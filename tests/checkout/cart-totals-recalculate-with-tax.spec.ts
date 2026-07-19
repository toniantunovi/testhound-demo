import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0014 - Cart totals recalculate with tax (suite: checkout / payment)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. The storefront models "entering a taxable address" as choosing a
 * tax region; California applies 8.25%. Expected figures below are derived from
 * a single Blue Mug at $12.00: tax = round(1200 * 0.0825) = $0.99, total $12.99.
 * Selectors confirmed against the running storefront (tax-region, apply-tax,
 * cart-subtotal, cart-tax, cart-total).
 */
test('Cart totals recalculate with tax', async ({ page }) => {
  // --- Step 1: Add items and enter a taxable address ---
  // Expected: subtotal, tax, and total are correct.

  // Add a Blue Mug ($12.00) so the subtotal is deterministic.
  await page.goto('/product/blue-mug');
  await page.getByRole('button', { name: /add to cart/i }).click();

  await page.goto('/cart');
  // Before choosing a region there is no tax.
  await expect(page.getByTestId('cart-subtotal')).toHaveText('$12.00');
  await expect(page.getByTestId('cart-tax')).toHaveText('$0.00');
  await expect(page.getByTestId('cart-total')).toHaveText('$12.00');

  // Enter a taxable region (California, 8.25%) and apply.
  await page.getByTestId('tax-region').selectOption('CA');
  await page.getByRole('button', { name: /apply/i }).click(); // fallback: getByTestId('apply-tax')

  // Recalculated totals.
  await expect(page.getByTestId('cart-subtotal')).toHaveText('$12.00');
  await expect(page.getByTestId('cart-tax')).toHaveText('$0.99');
  await expect(page.getByTestId('cart-total')).toHaveText('$12.99');
});
