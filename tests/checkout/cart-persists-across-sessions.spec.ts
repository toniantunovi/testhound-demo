import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0010 - Cart persists across sessions (suite: checkout / cart)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL and credentials are read from the Playwright config
 * (playwright.config.ts): baseURL, ACME_EMAIL, ACME_PASSWORD. The cart is tied
 * to the browser (an anonymous session id) rather than the auth session, so it
 * survives a sign-out / sign-in cycle. Selectors confirmed against the running
 * storefront.
 */
test('Cart persists across sessions', async ({ page }) => {
  const email = process.env.ACME_EMAIL!;
  const password = process.env.ACME_PASSWORD!;

  // --- Step 1: Add an item, then sign out and back in ---
  // Expected: the cart still contains the item.

  // Add an item.
  await page.goto('/product/notebook');
  await page.getByRole('button', { name: /add to cart/i }).click();
  await expect(page.getByTestId('cart-badge')).toHaveText('1');

  // Sign in.
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Sign out.
  await page.getByRole('button', { name: /log out/i }).click(); // fallback: getByTestId('logout')
  await expect(page).toHaveURL(/\/login/);

  // Sign back in.
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // The cart still holds the item.
  await page.goto('/cart');
  const row = page.getByTestId('cart-item');
  await expect(row).toHaveCount(1);
  await expect(row.getByTestId('cart-item-title')).toHaveText('Notebook');
});
