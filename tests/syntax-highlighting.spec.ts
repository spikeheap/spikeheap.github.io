import { test, expect } from '@playwright/test';
import { SAMPLE_POST_WITH_CODE, SECOND_POST_WITH_CODE } from './helpers/fixtures';

// The strongest signal that syntax highlighting is "working" is that token
// spans inside <pre><code> receive distinct colours from the loaded CSS — not
// just that the markup exists.
async function assertHighlighted(page: import('@playwright/test').Page, url: string) {
  await page.goto(url);

  const tokenSelector = 'pre [class], code [class]';
  const tokenCount = await page.locator(tokenSelector).count();
  expect(tokenCount, `expected highlighter token spans inside <pre>/<code> at ${url}`).toBeGreaterThan(0);

  const colors = await page.$$eval(tokenSelector, els =>
    Array.from(new Set(els.map(el => getComputedStyle(el).color)))
  );

  expect(
    colors.length,
    `expected at least two distinct token colours at ${url}, got: ${colors.join(', ')}`
  ).toBeGreaterThanOrEqual(2);
}

test.describe('syntax highlighting', () => {
  test('ruby code in a recent post is highlighted with distinct token colours', async ({ page }) => {
    await assertHighlighted(page, SAMPLE_POST_WITH_CODE);
  });

  test('shell/config code in an older post is highlighted with distinct token colours', async ({ page }) => {
    await assertHighlighted(page, SECOND_POST_WITH_CODE);
  });
});
