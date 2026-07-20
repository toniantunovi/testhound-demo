import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0035 - Search matches product titles only not descriptions or
 * ids (suite: search)
 *
 * Preconditions: User is on the Acme Shop storefront. Known products: Blue Mug,
 * Red Mug, Travel Mug, Notebook, Gel Pen.
 *
 * Base URL is read from the Playwright config (playwright.config.ts) via
 * baseURL. Selectors confirmed against the running storefront (same conventions
 * as the sibling search specs): a role="search" form with a labelled search box
 * and a "Search" button; the results panel is data-testid="search-results",
 * product tiles are data-testid="search-result", the empty-state message is
 * data-testid="search-empty", and the input is data-testid="search-input".
 *
 * Behaviour under test: search only matches product titles. A term that appears
 * only in a product description ("ceramic", "insulated") or a product id/handle
 * ("blue-mug") returns no results and shows the friendly empty-state message.
 */
test('Search matches product titles only not descriptions or ids', async ({ page }) => {
  const searchBox = () => page.getByLabel(/search products/i); // fallback: getByTestId('search-input')
  const submit = () => page.getByRole('button', { name: /search/i }); // fallback: getByTestId('search-submit')

  // A term that produces zero matches renders the panel with no tiles and the
  // empty-state message, and raises no client-side error.
  const expectNoMatches = async (term: string) => {
    await page.goto('/search');
    await searchBox().fill(term);
    await submit().click();

    await expect(page.getByTestId('search-results')).toBeVisible();
    await expect(page.getByTestId('search-result')).toHaveCount(0);
    await expect(page.getByTestId('search-empty')).toHaveText('No products match your search.');
  };

  // --- Step 1: search for a word that appears only in a product description ---
  // Expected (current behavior): no results, because search only matches the
  // product title. "ceramic" is in the Blue Mug blurb; "insulated" the Travel Mug.
  await expectNoMatches('ceramic');
  await expectNoMatches('insulated');

  // --- Step 2: search for a product id/handle, e.g. "blue-mug" ---
  // Expected (current behavior): no results; ids are not indexed for search.
  // (The "Blue Mug" title itself would match; the hyphenated id does not.)
  await expectNoMatches('blue-mug');
});
