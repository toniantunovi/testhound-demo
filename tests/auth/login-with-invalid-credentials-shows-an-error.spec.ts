import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0002 - Login with invalid credentials shows an error (suite: auth)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL and the valid account email are read from the environment via the
 * Playwright config (playwright.config.ts): BASE_URL, ACME_EMAIL. We reuse a
 * real email and deliberately submit a wrong password, so no secret is
 * hardcoded here.
 *
 * Selectors were confirmed by driving the running storefront: labelled email
 * and password fields, a "Log in" submit button, and an inline error rendered
 * as role="alert" (data-testid="login-error"). data-testid hooks (login-email,
 * login-password, login-submit, login-error) are available as fallbacks if the
 * accessible names ever change.
 */
test('Login with invalid credentials shows an error', async ({ page }) => {
  const email = process.env.ACME_EMAIL!;
  const wrongPassword = 'definitely-not-the-right-password';

  // --- Precondition: user is on the storefront login page ---
  // Expected: email and password fields are visible.
  await page.goto('/login');

  const emailField = page.getByLabel(/email/i); // fallback: page.getByTestId('login-email')
  const passwordField = page.getByLabel(/password/i); // fallback: page.getByTestId('login-password')
  await expect(emailField).toBeVisible();
  await expect(passwordField).toBeVisible();

  // --- Step 1: Submit a wrong password ---
  // Expected: an inline error is shown and no session is created.
  await emailField.fill(email);
  await passwordField.fill(wrongPassword);
  await page.getByRole('button', { name: /log in/i }).click(); // fallback: getByTestId('login-submit')

  // Assertion (Step 1, part a): an inline error is shown.
  const error = page.getByRole('alert'); // fallback: page.getByTestId('login-error')
  await expect(error).toBeVisible();
  await expect(error).toHaveText(/invalid email or password/i);
  // We stayed on the login page rather than reaching the dashboard.
  await expect(page).toHaveURL(/\/login/);

  // Assertion (Step 1, part b): no session is created.
  // The storefront sets an "acme_session" cookie only on success, so none
  // should exist here.
  const cookies = await page.context().cookies();
  expect(cookies.some((c) => c.name === 'acme_session')).toBe(false);
  // And the protected dashboard must still bounce back to /login.
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
