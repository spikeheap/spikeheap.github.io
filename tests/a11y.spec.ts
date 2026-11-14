import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loadPosts } from './helpers/posts';
import { TOP_LEVEL_PAGES } from './helpers/fixtures';

// Every page on the site, not a sample. Most failures found in the November
// 2026 audit lived in old post content that a sample would have missed.
const URLS = ['/', ...TOP_LEVEL_PAGES.map(p => p.url), ...loadPosts().map(p => p.url)];

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

// Link text that says nothing about the destination when read out of context.
const VAGUE_LINK_TEXT = /^(here|click here|this|that|link|article|post|more|read more|this one)$/i;
const NEW_TAB_HINT = / \(opens in new tab\)$/;

async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return results.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map(n => n.target.join(' ')),
  }));
}

for (const url of URLS) {
  test.describe(`accessibility: ${url}`, () => {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`has no axe violations (${colorScheme})`, async ({ browser }) => {
        const context = await browser.newContext({ colorScheme });
        const page = await context.newPage();
        await page.goto(url);
        expect(await axeViolations(page)).toEqual([]);
        await context.close();
      });
    }

    test('has a sound document structure', async ({ page }) => {
      await page.goto(url);

      await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
      await expect(page.locator('h1')).toHaveCount(1);

      const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(hs =>
        hs.map(h => ({ level: Number(h.tagName[1]), text: h.textContent?.trim() ?? '' }))
      );
      const skips = levels.filter((h, i) => i > 0 && h.level - levels[i - 1].level > 1);
      expect(skips, 'heading levels must not skip').toEqual([]);
    });

    test('has descriptive link text', async ({ page }) => {
      await page.goto(url);

      const names = await page.locator('main a[href]').evaluateAll(links =>
        links.map(a => (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' '))
      );
      const texts = names.map(n => n.replace(NEW_TAB_HINT, ''));

      expect(texts.filter(t => t === ''), 'links need text').toEqual([]);
      expect(texts.filter(t => VAGUE_LINK_TEXT.test(t)), 'vague link text').toEqual([]);
      expect(texts.filter(t => /^https?:\/\//i.test(t)), 'bare URL as link text').toEqual([]);
    });

    test('announces links that open in a new tab', async ({ page }) => {
      await page.goto(url);

      const unannounced = await page.locator('a[target="_blank"]').evaluateAll(links =>
        links.filter(a => !/opens in new tab/.test(a.textContent ?? '')).map(a => a.getAttribute('href'))
      );
      expect(unannounced).toEqual([]);
    });

    test('code blocks are keyboard focusable', async ({ page }) => {
      await page.goto(url);

      const unfocusable = await page.locator('pre').evaluateAll(pres => pres.filter(p => p.tabIndex !== 0).length);
      expect(unfocusable).toBe(0);
    });

    // Rouge error tokens get a wavy underline. They mean invalid code or a
    // fence tagged with the wrong language.
    test('code blocks have no lexer errors', async ({ page }) => {
      await page.goto(url);

      await expect(page.locator('.highlight .err')).toHaveCount(0);
    });

    test('reflows at 320px without horizontal scrolling', async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
      const page = await context.newPage();
      await page.goto(url);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await context.close();
    });
  });
}
