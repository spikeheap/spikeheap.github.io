import { test, expect } from '@playwright/test';
import { loadPosts } from './helpers/posts';

const HREF_RE = /href="(\/[^"#?]*)/g;

// Paths injected by third parties that we shouldn't treat as site links.
const SKIP_PREFIXES = ['/cdn-cgi/'];

function extractInternalHrefs(html: string): string[] {
  const hrefs = new Set<string>();
  for (const match of html.matchAll(HREF_RE)) {
    const href = match[1];
    // Skip schema-relative ("//example.com") and anchor-only refs.
    if (href.startsWith('//') || href === '') continue;
    if (SKIP_PREFIXES.some(prefix => href.startsWith(prefix))) continue;
    hrefs.add(href);
  }
  return [...hrefs];
}

test('every internal link across posts and pages resolves', async ({ request }) => {
  test.slow();

  const seeds = ['/', ...loadPosts().map(p => p.url), '/now/', '/prev/', '/posts-by-year/', '/tags/'];

  const allHrefs = new Set<string>();
  for (const seed of seeds) {
    const response = await request.get(seed);
    if (response.status() !== 200) continue;
    const html = await response.text();
    for (const href of extractInternalHrefs(html)) {
      allHrefs.add(href);
    }
  }

  expect(allHrefs.size, 'expected to discover internal links').toBeGreaterThan(0);

  const failures: { url: string; status: number }[] = [];
  // Probe each unique href. Use GET (not HEAD) because some hosts don't
  // implement HEAD for redirected paths.
  for (const href of allHrefs) {
    const response = await request.get(href);
    if (response.status() !== 200) {
      failures.push({ url: href, status: response.status() });
    }
  }

  expect(
    failures,
    `broken internal links:\n${failures.map(f => `  ${f.url} → ${f.status}`).join('\n')}`
  ).toEqual([]);
});
