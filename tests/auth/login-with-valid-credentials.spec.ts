import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0001 - Login with valid credentials (suite: auth)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL and credentials are read from the environment via the Playwright
 * config (playwright.config.ts): BASE_URL, ACME_EMAIL, ACME_PASSWORD. The
 * config supplies local demo defaults so the showcase runs out of the box;
 * override them with real values in a real environment.
 *
 * Selectors were confirmed by driving the running storefront (labelled fields,
 * a "Log in" submit button, and a Dashboard landing view). data-testid hooks
 * (login-email, login-password, login-submit, dashboard) are also available as
 * fallbacks if the accessible names ever change.
 */
test('Login with valid credentials', async ({ page }) => {
  const email = process.env.ACME_EMAIL!;
  const password = process.env.ACME_PASSWORD!;

  // --- Step 1: Open the login page ---
  // Expected: Email and password fields are visible.
  await page.goto('/login');

  const emailField = page.getByLabel(/email/i); // fallback: page.getByTestId('login-email')
  const passwordField = page.getByLabel(/password/i); // fallback: page.getByTestId('login-password')
  await expect(emailField).toBeVisible();
  await expect(passwordField).toBeVisible();

  // --- Step 2: Enter valid credentials and submit ---
  // Expected: User lands on the dashboard.
  await emailField.fill(email);
  await passwordField.fill(password);
  await page.getByRole('button', { name: /log in/i }).click(); // fallback: getByTestId('login-submit')

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
});
