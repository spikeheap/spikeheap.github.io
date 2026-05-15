import { test, expect } from '@playwright/test';
import { ROOT_FILES } from './helpers/fixtures';
import { loadPosts } from './helpers/posts';

test.describe('root files', () => {
  for (const file of ROOT_FILES) {
    test(`${file.url} is served`, async ({ request }) => {
      const response = await request.get(file.url);
      expect(response.status()).toBe(200);
      if (file.contentTypeIncludes) {
        const contentType = response.headers()['content-type'] ?? '';
        expect(contentType).toContain(file.contentTypeIncludes);
      }
      if (file.bodyIncludes) {
        const body = await response.text();
        expect(body).toContain(file.bodyIncludes);
      }
    });
  }
});

test.describe('feed and sitemap content', () => {
  test('feed.xml lists at least one known post', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();
    const posts = loadPosts();
    const recentPost = posts[posts.length - 1];
    // The feed entry's <link> may be either the no-slash or .html form.
    expect(body).toMatch(new RegExp(`${recentPost.date}-${recentPost.slug}`));
  });

  test('sitemap.xml references every published post', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const body = await response.text();
    const posts = loadPosts();
    const missing: string[] = [];
    for (const post of posts) {
      const fragment = `${post.date}-${post.slug}`;
      if (!body.includes(fragment)) missing.push(post.filename);
    }
    expect(missing, `sitemap is missing entries for: ${missing.join(', ')}`).toEqual([]);
  });
});
