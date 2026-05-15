import { test, expect } from '@playwright/test';
import { TOP_LEVEL_PAGES } from './helpers/fixtures';

test.describe('top-level pages', () => {
  test('homepage renders site title and links to at least one post', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Ryan Brooks/);
    // The home layout lists recent posts as anchors into /posts/...
    const postLinks = page.locator('a[href*="/posts/"]');
    expect(await postLinks.count()).toBeGreaterThan(0);
  });

  for (const { url, headingContains } of TOP_LEVEL_PAGES) {
    test(`${url} renders the expected heading`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      const heading = page.locator('h1').first();
      await expect(heading).toContainText(headingContains);
    });
  }

  test('unknown path returns 404 with the custom 404 body', async ({ request }) => {
    const response = await request.get('/this-page-definitely-does-not-exist');
    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).toMatch(/pixels are in another canvas|Page Not Found/);
  });
});
