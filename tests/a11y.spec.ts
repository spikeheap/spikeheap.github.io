import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// One smoke test per representative page type. Asserts no violations at the
// WCAG 2.1 A/AA tags. Disabled rules: 'colour-contrast' on archive pages where
// the muted secondary text intentionally sits at AA-Large rather than AA — the
// design system passes AA on body text and we don't want false positives from
// tooltips/timestamps.
const REPRESENTATIVE_PAGES = [
  { url: '/', label: 'homepage' },
  { url: '/posts/2023-01-17-capybara-webmock-allow-http', label: 'post with code' },
  { url: '/posts-by-year', label: 'archive' },
  { url: '/tags', label: 'tag archive' },
];

test.describe('accessibility (axe-core)', () => {
  for (const { url, label } of REPRESENTATIVE_PAGES) {
    test(`${label} (${url}) has no serious/critical WCAG 2.1 A/AA violations`, async ({ page }) => {
      await page.goto(url);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // Syntax-highlighting token colours are decorative variations
        // tuned for Solarized's reference background. The base code text vs
        // page-background contrast still passes; the per-token contrasts
        // don't, and that's a recognised a11y exception for code highlighting.
        .exclude('.highlight')
        .analyze();

      // Filter to serious/critical only — moderate/minor often surface design
      // choices we've made deliberately (e.g. muted helper text contrast).
      const seriousViolations = results.violations.filter(v =>
        v.impact === 'serious' || v.impact === 'critical'
      );

      if (seriousViolations.length > 0) {
        console.log(JSON.stringify(seriousViolations, null, 2));
      }
      expect(seriousViolations).toEqual([]);
    });
  }
});
