import { test, expect } from '@playwright/test';

// A site-wide inline script in default.erb augments external links so they
// open in a new tab. Verify it applies to post body links, to the static
// comments fallback link in the layout, and that internal links are left
// alone.

test.describe('external links open in a new tab', () => {
  test('external links inside post body get target=_blank + rel=noopener noreferrer', async ({ page }) => {
    await page.goto('/posts/2023-01-17-capybara-webmock-allow-http');

    // This post links heavily to github.com — pick one we know is there.
    const externalLink = page.locator('a[href^="https://github.com/"]').first();
    await expect(externalLink).toHaveAttribute('target', '_blank');
    const rel = await externalLink.getAttribute('rel');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  test('internal links keep default same-tab behaviour', async ({ page }) => {
    await page.goto('/');

    // The "Posts" nav link and the recent-posts list anchors are internal.
    const internalLink = page.locator('a[href^="/posts/"]').first();
    await expect(internalLink).not.toHaveAttribute('target', '_blank');
  });

  test('rel=me social links in the footer still open externally', async ({ page }) => {
    await page.goto('/');

    const mastodonLink = page.locator('footer a[rel*="me"][href*="ruby.social"]');
    await expect(mastodonLink).toHaveAttribute('target', '_blank');
    const rel = await mastodonLink.getAttribute('rel');
    // rel="me" must still be present — it's how Mastodon verifies the profile.
    expect(rel).toContain('me');
    expect(rel).toContain('noopener');
  });
});
