import { test, expect } from '@playwright/test';
import { loadPosts } from './helpers/posts';

const posts = loadPosts();

// kramdown converts straight quotes to typographic ones and "--" to en/em
// dashes; templates may HTML-encode quotes too. Normalise both sides so
// title assertions survive the rendering.
function normaliseText(s: string): string {
  return s
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

test.describe('post permalinks', () => {
  for (const post of posts) {
    test(`${post.url} resolves with the post title`, async ({ page }) => {
      const response = await page.goto(post.url);
      expect(response?.status(), `expected 200 for ${post.url}`).toBe(200);

      // The minimal-mistakes theme wraps the title in an anchor inside
      // <h1 class="page__title">. Check rendered text rather than markup so
      // the assertion survives a theme overhaul.
      const heading = page.locator('h1').first();
      const text = normaliseText((await heading.textContent()) ?? '');
      expect(text).toContain(normaliseText(post.title));
    });

    test(`${post.url}.html also serves the same post`, async ({ request }) => {
      const response = await request.get(`${post.url}.html`);
      expect(response.status(), `expected 200 for ${post.url}.html`).toBe(200);
      const body = normaliseText(await response.text());
      expect(body).toContain(normaliseText(post.title));
    });
  }
});
