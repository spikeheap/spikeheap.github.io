import { test, expect } from '@playwright/test';
import { KNOWN_TAGS } from './helpers/fixtures';
import { loadPosts } from './helpers/posts';

test.describe('archives', () => {
  test('/tags/ surfaces known tags from post frontmatter', async ({ page }) => {
    await page.goto('/tags/');
    const body = await page.locator('body').textContent();
    for (const tag of KNOWN_TAGS) {
      expect(body, `expected /tags/ to mention "${tag}"`).toContain(tag);
    }
  });

  test('/posts-by-year/ shows multiple years and links to posts', async ({ page }) => {
    await page.goto('/posts-by-year/');
    const body = await page.locator('body').textContent();
    // Span between oldest and newest posts must both be represented.
    const posts = loadPosts();
    const oldestYear = posts[0].date.slice(0, 4);
    const newestYear = posts[posts.length - 1].date.slice(0, 4);
    expect(body).toContain(oldestYear);
    expect(body).toContain(newestYear);

    const postLinks = page.locator('a[href*="/posts/"]');
    expect(await postLinks.count()).toBeGreaterThan(10);
  });
});
