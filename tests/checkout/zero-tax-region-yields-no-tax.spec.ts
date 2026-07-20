import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0040 - Zero-tax region yields no tax (suite: checkout / payment)
 *
 * Preconditions: User is on the Acme Shop storefront with at least one item in
 * the cart. We satisfy the precondition by adding a single Blue Mug ($12.00) so
 * the subtotal is deterministic.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL; nothing is hardcoded here. Selectors were confirmed by driving the
 * running storefront: the tax region <select> and its option labels
 * ("Oregon (no sales tax)", "Select a region") plus the totals rows
 * (cart-subtotal, cart-tax, cart-total) are all backed by data-testid hooks.
 * Regions are selected by visible label so the test does not depend on the
 * app's internal region codes.
 */
test('Zero-tax region yields no tax', async ({ page }) => {
  // Precondition: put one item in the cart so the cart has totals to show.
  await page.goto('/product/blue-mug');
  await page.getByRole('button', { name: /add to cart/i }).click(); // fallback: getByTestId('product-add-to-cart')

  await page.goto('/cart');
  const subtotal = page.getByTestId('cart-subtotal');
  const tax = page.getByTestId('cart-tax');
  const total = page.getByTestId('cart-total');

  // The subtotal is fixed by the single line item; both regions below are
  // zero-rated, so tax must be $0.00 and total must equal this subtotal.
  await expect(subtotal).toHaveText('$12.00');
  const subtotalText = (await subtotal.textContent())?.trim();

  // --- Step 1: Select "Oregon (no sales tax)" and apply ---
  // Expected: Tax shows $0.00 and the total equals the subtotal.
  await page.getByTestId('tax-region').selectOption({ label: 'Oregon (no sales tax)' });
  await page.getByRole('button', { name: /apply/i }).click(); // fallback: getByTestId('apply-tax')
  await expect(tax).toHaveText('$0.00');
  await expect(total).toHaveText(subtotalText!);
  await expect(subtotal).toHaveText(subtotalText!);

  // --- Step 2: Select the default "Select a region" option and apply ---
  // Expected: Tax remains $0.00 and the total still equals the subtotal.
  await page.getByTestId('tax-region').selectOption({ label: 'Select a region' });
  await page.getByRole('button', { name: /apply/i }).click(); // fallback: getByTestId('apply-tax')
  await expect(tax).toHaveText('$0.00');
  await expect(total).toHaveText(subtotalText!);
  await expect(subtotal).toHaveText(subtotalText!);
});
