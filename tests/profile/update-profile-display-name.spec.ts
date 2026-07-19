import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0031 - Update profile display name (suite: profile)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL, so nothing environment-specific is hardcoded here.
 *
 * Selectors were confirmed by driving the running storefront: the profile form
 * exposes a labelled "Display name" field and a "Save" button, and the header
 * renders the saved name (data-testid="header-display-name"). data-testid hooks
 * (profile-display-name, profile-save, header-display-name) are available as
 * fallbacks if the accessible names ever change.
 */
test('Update profile display name', async ({ page }) => {
  const newName = 'Ada Lovelace';

  // --- Step 1: Change the display name and save ---
  // Expected: the new name appears in the header.
  await page.goto('/profile');

  const nameField = page.getByLabel(/display name/i); // fallback: page.getByTestId('profile-display-name')
  await expect(nameField).toBeVisible();
  await nameField.fill(newName);
  await page.getByRole('button', { name: /save/i }).click(); // fallback: getByTestId('profile-save')

  // Assertion (Step 1): the header greets the user by the saved display name.
  const headerName = page.getByTestId('header-display-name');
  await expect(headerName).toBeVisible();
  await expect(headerName).toContainText(newName);
});
