import { test, expect } from '@playwright/test';
import { loadPosts } from './helpers/posts';
import { TOP_LEVEL_PAGES } from './helpers/fixtures';

// Posts and pages share the same canonical: no trailing slash, with a .html
// alternate that GitHub Pages also serves. Pages additionally have
// jekyll-redirect-from stubs at the with-slash form so legacy inbound links
// keep working. Posts don't (yet) have those stubs — the with-slash test for
// posts is `fixme`'d.
//
// The "resolves" tests follow redirects so they pass on both WEBrick (which
// auto-redirects no-slash → slash when an index exists) and GitHub Pages
// (which serves no-slash directly and uses the redirect stub on with-slash).

const samplePosts = loadPosts().slice(0, 5);

function assertResolves(url: string) {
  test(`${url} (no slash) reaches a 200`, async ({ request }) => {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
  });
}

test.describe('post trailing-slash policy', () => {
  for (const post of samplePosts) {
    assertResolves(post.url);

    test.fixme(`${post.url}/ (with slash) also resolves`, async ({ request }) => {
      const response = await request.get(`${post.url}/`);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe('page trailing-slash policy', () => {
  for (const { url } of TOP_LEVEL_PAGES) {
    assertResolves(url);

    test(`${url}/ (with slash) serves a redirect stub pointing at ${url}`, async ({ request }) => {
      const response = await request.get(`${url}/`, { maxRedirects: 0 });
      expect(response.status()).toBe(200);
      const body = await response.text();
      // jekyll-redirect-from emits a meta-refresh + JS redirect targeting the
      // canonical no-slash URL. Match either http or https and any host.
      expect(body).toMatch(new RegExp(`url=https?://[^"/]+${url}(?:["'\\s]|$)`));
    });
  }
});
