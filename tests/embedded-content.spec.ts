import { test, expect } from '@playwright/test';
import { POST_WITH_TWEET, TWEET_ID_IN_POST } from './helpers/fixtures';

test.describe('embedded tweets', () => {
  // The current site embeds tweets as <blockquote class="twitter-tweet"> with
  // a link containing the tweet ID. If the new system uses a different
  // shortcode/component, the tweet ID is the stable signal that the embed
  // survived the migration.
  test(`tweet ${TWEET_ID_IN_POST} is referenced in the rendered post`, async ({ request }) => {
    const response = await request.get(POST_WITH_TWEET);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain(TWEET_ID_IN_POST);
  });
});
