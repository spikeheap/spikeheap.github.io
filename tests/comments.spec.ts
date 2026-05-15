import { test, expect } from '@playwright/test';

// The Mastodon comments feature is wired into post.erb conditionally on
// frontmatter. To avoid adding placeholder toot URLs to real posts, these
// tests inject the markup via page.setContent and load the real comments.js
// from disk. Mastodon API calls are intercepted by page.route.

const TOOT_URL = 'https://ruby.social/@spikeheap/12345';
const STATUS_API = 'https://ruby.social/api/v1/statuses/12345';

const COMMENTS_MARKUP = `
<!DOCTYPE html>
<html lang="en">
<body>
  <section class="comments" data-mastodon-toot="${TOOT_URL}">
    <h2 class="comments__heading">Comments</h2>
    <p>
      <a class="comments__link" href="${TOOT_URL}">View the conversation on Mastodon</a>
    </p>
    <ol class="comments__list" hidden></ol>
  </section>
</body>
</html>
`;

const MOCK_STATUS = {
  replies_count: 2,
  reblogs_count: 5,
  favourites_count: 12,
};

const MOCK_CONTEXT = {
  ancestors: [],
  descendants: [
    {
      id: '101',
      in_reply_to_id: null,
      account: {
        display_name: 'Alice',
        username: 'alice',
        acct: 'alice@example.social',
        avatar: 'https://example.social/avatar/alice.png',
        url: 'https://example.social/@alice',
      },
      url: 'https://example.social/@alice/101',
      created_at: '2024-01-15T10:00:00Z',
      content: '<p>Great post!</p>',
    },
    {
      id: '102',
      in_reply_to_id: '101',
      account: {
        display_name: 'Bob',
        username: 'bob',
        acct: 'bob@another.social',
        avatar: 'https://another.social/avatar/bob.png',
        url: 'https://another.social/@bob',
      },
      url: 'https://another.social/@bob/102',
      created_at: '2024-01-15T11:00:00Z',
      content: '<p>Thanks for the link.</p>',
    },
  ],
};

test.describe('mastodon comments', () => {
  test('no-JS fallback link is visible before hydration', async ({ page }) => {
    // Block the API so hydration never completes — fallback should still work.
    await page.route(`${STATUS_API}*`, route => route.abort());

    await page.setContent(COMMENTS_MARKUP);

    const link = page.locator('.comments__link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', TOOT_URL);
    await expect(link).toHaveText('View the conversation on Mastodon');

    // The list should remain hidden when there are no replies to show.
    await expect(page.locator('.comments__list')).toBeHidden();
  });

  test('hydrates link text with counts and renders threaded replies', async ({ page }) => {
    await page.route(STATUS_API, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(MOCK_STATUS) })
    );
    await page.route(`${STATUS_API}/context`, route =>
      route.fulfill({ contentType: 'application/json', body: JSON.stringify(MOCK_CONTEXT) })
    );

    await page.setContent(COMMENTS_MARKUP);
    await page.addScriptTag({ path: 'src/comments.js' });

    // Link text picks up the counts.
    const link = page.locator('.comments__link');
    await expect(link).toContainText('2 replies');
    await expect(link).toContainText('5 boosts');
    await expect(link).toContainText('12 favourites');

    // Top-level list becomes visible, with two reply elements total.
    const topList = page.locator('.comments > .comments__list');
    await expect(topList).toBeVisible();

    const allReplies = page.locator('.comment');
    await expect(allReplies).toHaveCount(2);

    // Exactly one top-level reply at depth 1 (direct child of top list).
    const topLevelReplies = page.locator('.comments > .comments__list > .comment');
    await expect(topLevelReplies).toHaveCount(1);

    // One nested reply inside the top-level reply's own list.
    const nestedReplies = page.locator('.comments > .comments__list > .comment > .comments__list > .comment');
    await expect(nestedReplies).toHaveCount(1);

    // Reply content surfaces.
    await expect(page.locator('.comment__content').first()).toContainText('Great post!');
    await expect(page.locator('.comment__content').nth(1)).toContainText('Thanks for the link.');

    // Author and permalink links open externally.
    const authorLink = page.locator('.comment__author').first();
    await expect(authorLink).toHaveAttribute('target', '_blank');
    await expect(authorLink).toHaveAttribute('rel', /noopener/);
    const permalink = page.locator('.comment__permalink').first();
    await expect(permalink).toHaveAttribute('target', '_blank');
  });

  test('singular vs plural in count text', async ({ page }) => {
    await page.route(STATUS_API, route =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ replies_count: 1, reblogs_count: 0, favourites_count: 1 }),
      })
    );
    await page.route(`${STATUS_API}/context`, route =>
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ ancestors: [], descendants: [] }),
      })
    );

    await page.setContent(COMMENTS_MARKUP);
    await page.addScriptTag({ path: 'src/comments.js' });

    const link = page.locator('.comments__link');
    await expect(link).toContainText('1 reply');     // singular
    await expect(link).toContainText('1 favourite'); // singular
    await expect(link).not.toContainText('boost');   // zero is omitted
  });

  test('posts without mastodon frontmatter have no comments section', async ({ page }) => {
    await page.goto('/posts/2023-01-17-capybara-webmock-allow-http');
    await expect(page.locator('.comments')).toHaveCount(0);
  });
});
