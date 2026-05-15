import { test, expect } from '@playwright/test';
import { loadImageFilenames } from './helpers/posts';
import { POST_WITH_IMAGES } from './helpers/fixtures';

test.describe('image assets', () => {
  test('every file in src/images/ is reachable under /images/', async ({ request }) => {
    const files = loadImageFilenames();
    expect(files.length, 'expected to find image files in src/images/').toBeGreaterThan(0);

    const failures: { file: string; status: number }[] = [];
    for (const file of files) {
      const url = `/images/${file}`;
      // GET instead of HEAD: Bridgetown's local dev server only routes GET
      // through its SSG plugin, even though static hosts like GH Pages support
      // both. We discard the response body to keep this cheap.
      const response = await request.get(url, { maxRedirects: 0 });
      if (response.status() !== 200) {
        failures.push({ file: url, status: response.status() });
      }
    }
    expect(
      failures,
      `unreachable images:\n${failures.map(f => `  ${f.file} → ${f.status}`).join('\n')}`
    ).toEqual([]);
  });

  test('images in an image-heavy post load in the browser', async ({ page }) => {
    await page.goto(POST_WITH_IMAGES);
    const imgs = page.locator('article img, .page__content img');
    const count = await imgs.count();
    expect(count, 'expected the sample post to contain <img> elements').toBeGreaterThan(0);

    const widths = await imgs.evaluateAll(els =>
      els.map(el => ({ src: (el as HTMLImageElement).currentSrc, w: (el as HTMLImageElement).naturalWidth }))
    );
    const broken = widths.filter(w => w.w === 0);
    expect(
      broken,
      `images failed to load:\n${broken.map(b => `  ${b.src}`).join('\n')}`
    ).toEqual([]);
  });
});
