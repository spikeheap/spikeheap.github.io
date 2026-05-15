import { test, expect } from '@playwright/test';

const SAMPLE_PAGE = '/posts/2023-01-17-capybara-webmock-allow-http';

test.describe('dark mode toggle', () => {
  test('OS preference applies on first load (no localStorage)', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto(SAMPLE_PAGE);

    // No data-theme attribute should be set when there's no localStorage —
    // the @media (prefers-color-scheme: dark) block does the work.
    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBeNull();

    // The computed background colour should reflect the dark palette.
    const bg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('background-color').trim()
    );
    expect(bg).toBe('rgb(28, 26, 24)'); // #1c1a18

    await context.close();
  });

  test('toggle flips theme and persists to localStorage', async ({ page }) => {
    await page.goto(SAMPLE_PAGE);

    const toggle = page.locator('[data-theme-toggle]');
    await expect(toggle).toBeVisible();

    // Snapshot initial body background.
    const initialBg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('background-color').trim()
    );

    await toggle.click();

    // After click, data-theme should be set (the toggle always commits a value).
    const themeAfterClick = await page.locator('html').getAttribute('data-theme');
    expect(themeAfterClick === 'light' || themeAfterClick === 'dark').toBe(true);

    const newBg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('background-color').trim()
    );
    expect(newBg).not.toBe(initialBg);

    // The choice should be in localStorage.
    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBe(themeAfterClick);
  });

  test('persisted preference re-applies on reload without flash', async ({ page }) => {
    await page.goto(SAMPLE_PAGE);
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    await page.reload();

    // The inline <head> script must have applied the attribute before paint.
    // We check that the attribute is in place immediately on document load.
    const dataTheme = await page.locator('html').getAttribute('data-theme');
    expect(dataTheme).toBe('dark');

    const bg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('background-color').trim()
    );
    expect(bg).toBe('rgb(28, 26, 24)');
  });
});
