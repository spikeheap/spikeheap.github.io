import { test, expect } from '@playwright/test';

// Webmentions are wired into post.erb when site_metadata.webmention_endpoint is
// set. These tests inject the section markup via page.setContent and load the
// real webmentions.js from disk, mocking webmention.io's jf2 API with page.route.

const TARGET = 'https://ryanbrooks.co.uk/posts/example-post';
const API_URL_PATTERN = '**/api/mentions.jf2*';

const MARKUP = `
<!DOCTYPE html>
<html lang="en">
<head>
  <style>.visually-hidden { position: absolute; width: 1px; height: 1px; clip: rect(0 0 0 0); }</style>
</head>
<body>
  <section class="webmentions" data-webmentions data-webmentions-target="${TARGET}">
    <div class="webmentions__content" hidden></div>
  </section>
</body>
</html>
`;

function mention(overrides: Record<string, unknown>) {
  return {
    type: 'entry',
    author: {
      type: 'card',
      name: 'Sample Author',
      photo: 'https://example.com/avatar.png',
      url: 'https://example.com/@sample',
    },
    url: 'https://example.com/mention/1',
    published: '2024-02-01T10:00:00Z',
    'wm-source': 'https://example.com/mention/1',
    'wm-target': TARGET,
    'wm-property': 'in-reply-to',
    content: { html: '<p>A reply.</p>', text: 'A reply.' },
    ...overrides,
  };
}

test.describe('webmentions', () => {
  test('section stays hidden when there are no mentions', async ({ page }) => {
    await page.route(API_URL_PATTERN, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ type: 'feed', children: [] }) })
    );
    await page.setContent(MARKUP);
    await page.addScriptTag({ path: 'src/webmentions.js' });

    // Give the fetch a beat, then assert nothing was revealed.
    await page.waitForTimeout(200);
    await expect(page.locator('.webmentions__content')).toBeHidden();
    await expect(page.locator('.webmentions__heading')).toHaveCount(0);
  });

  test('renders likes and reposts as facepiles', async ({ page }) => {
    const mentions = [
      mention({ 'wm-property': 'like-of', author: { name: 'Liker One', photo: 'https://example.com/a.png', url: 'https://example.com/@one' } }),
      mention({ 'wm-property': 'like-of', author: { name: 'Liker Two', photo: 'https://example.com/b.png', url: 'https://example.com/@two' } }),
      mention({ 'wm-property': 'repost-of', author: { name: 'Reposter', photo: 'https://example.com/c.png', url: 'https://example.com/@three' } }),
    ];
    await page.route(API_URL_PATTERN, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ type: 'feed', children: mentions }) })
    );
    await page.setContent(MARKUP);
    await page.addScriptTag({ path: 'src/webmentions.js' });

    await expect(page.locator('.webmentions__heading')).toHaveText('Webmentions');

    const facepiles = page.locator('.facepile');
    await expect(facepiles).toHaveCount(2);
    await expect(facepiles.nth(0).locator('.facepile__heading')).toContainText('Likes (2)');
    await expect(facepiles.nth(0).locator('.facepile__avatar')).toHaveCount(2);
    await expect(facepiles.nth(1).locator('.facepile__heading')).toContainText('Reposts (1)');
    await expect(facepiles.nth(1).locator('.facepile__avatar')).toHaveCount(1);

    // Avatar links open externally.
    const avatarLink = facepiles.nth(0).locator('.facepile__item').first();
    await expect(avatarLink).toHaveAttribute('target', '_blank');
    await expect(avatarLink).toHaveAttribute('rel', /noopener/);
  });

  test('renders replies and mentions as comment cards', async ({ page }) => {
    const mentions = [
      mention({
        'wm-property': 'in-reply-to',
        author: { name: 'Replier', photo: 'https://example.com/r.png', url: 'https://example.com/@r' },
        content: { html: '<p>Thoughtful response.</p>' },
        published: '2024-02-01T10:00:00Z',
      }),
      mention({
        'wm-property': 'mention-of',
        author: { name: 'Mentioner', photo: 'https://example.com/m.png', url: 'https://example.com/@m' },
        content: { html: '<p>I linked to this on my blog.</p>' },
        published: '2024-02-02T10:00:00Z',
      }),
    ];
    await page.route(API_URL_PATTERN, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ type: 'feed', children: mentions }) })
    );
    await page.setContent(MARKUP);
    await page.addScriptTag({ path: 'src/webmentions.js' });

    const repliesHeading = page.locator('.webmentions__replies-heading');
    await expect(repliesHeading).toContainText('Replies and mentions (2)');

    const replies = page.locator('.webmentions__replies .comment');
    await expect(replies).toHaveCount(2);
    await expect(replies.nth(0).locator('.comment__content')).toContainText('Thoughtful response.');
    await expect(replies.nth(1).locator('.comment__content')).toContainText('I linked to this on my blog.');

    // Author + permalink open externally.
    await expect(replies.nth(0).locator('.comment__author')).toHaveAttribute('target', '_blank');
    await expect(replies.nth(0).locator('.comment__permalink')).toHaveAttribute('target', '_blank');
  });

  test('mixed: likes + reposts + replies all render in expected order', async ({ page }) => {
    const mentions = [
      mention({ 'wm-property': 'like-of' }),
      mention({ 'wm-property': 'repost-of' }),
      mention({ 'wm-property': 'in-reply-to' }),
    ];
    await page.route(API_URL_PATTERN, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify({ type: 'feed', children: mentions }) })
    );
    await page.setContent(MARKUP);
    await page.addScriptTag({ path: 'src/webmentions.js' });

    // Section reveals; all three subsections present.
    await expect(page.locator('.webmentions__content')).toBeVisible();
    await expect(page.locator('.facepile')).toHaveCount(2);              // likes + reposts
    await expect(page.locator('.webmentions__replies .comment')).toHaveCount(1);
  });
});
