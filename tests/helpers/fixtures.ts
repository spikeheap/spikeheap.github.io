export interface PageFixture {
  url: string;
  headingContains: string;
}

// Pages and posts share the same canonical form: no trailing slash, with a
// `.html` alternate that GitHub Pages also serves. Substrings avoid kramdown
// smart-quote conversion of apostrophes.
export const TOP_LEVEL_PAGES: PageFixture[] = [
  { url: '/now', headingContains: 'doing now' },
  { url: '/cv', headingContains: 'Ryan Brooks' },
  { url: '/cv/security', headingContains: 'Ryan Brooks' },
  { url: '/services', headingContains: 'Working with' },
  { url: '/posts-by-year', headingContains: 'Posts by year' },
  { url: '/tags', headingContains: 'Posts by Tag' },
];

export interface RootFile {
  url: string;
  contentTypeIncludes?: string;
  bodyIncludes?: string;
}

// Only files that are actually served on production. Notably excluded:
// - /CNAME — build artefact, 404 on prod
// - /.well-known/mta-sts.txt — GitHub Pages drops hidden directories
export const ROOT_FILES: RootFile[] = [
  { url: '/feed.xml', contentTypeIncludes: 'xml' },
  { url: '/sitemap.xml', contentTypeIncludes: 'xml' },
  { url: '/robots.txt', contentTypeIncludes: 'text/plain' },
  { url: '/keybase.txt', bodyIncludes: 'keybase' },
];

// Posts whose canonical permalink format is no-trailing-slash. The .html
// suffix is also served and is what /sitemap.xml currently declares as
// canonical, so external links and search engines use that form.
export function postCanonicalUrl(slug: string, date: string): string {
  return `/posts/${date}-${slug}`;
}

export function postHtmlUrl(slug: string, date: string): string {
  return `/posts/${date}-${slug}.html`;
}

// Sample posts exercising distinct content features.
export const SAMPLE_POST_WITH_CODE = '/posts/2023-01-17-capybara-webmock-allow-http';
export const SECOND_POST_WITH_CODE = '/posts/2013-08-22-simple-rsnapshot-backup-over-ftps';
export const POST_WITH_TWEET = '/posts/2014-08-27-jsoxford-nodebots-day';
export const TWEET_ID_IN_POST = '503178382201618433';
export const POST_WITH_IMAGES = '/posts/2013-12-01-pi-powered-central-heating-phase-1';

export const KNOWN_TAGS = ['rant', 'update'];
