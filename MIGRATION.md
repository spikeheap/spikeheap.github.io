# Migration log

Audit trail for the Jekyll → Bridgetown migration. One section per phase.

## Phase 0 — Third-party content extraction

Goal: remove every build-time and render-time third-party content fetch from posts. The repo now contains everything a post needs to render.

### Gists

Both gists were already inlined further down in the relevant posts as fenced code blocks. Only the TLDR/intro links pointing at `gist.github.com` were removed and replaced with in-page anchor links.

| Gist ID | Files | Post | Action |
| --- | --- | --- | --- |
| `b5428f11834a0cea3822` | `soapAddMemberToGroup.groovy` | `2014-08-21-groovy-soap-wslite.md` | Replaced TLDR gist link with `#the-full-script` anchor; renamed inline lead-in heading. Code already present. |
| `488929887d22e74783a5f4f982981a84` | `Dockerfile`, `nginx.conf` | `2016-05-19-nginx-docker-proxy.md` | Replaced TLDR gist link with `#the-setup` anchor. Both files already present as fenced blocks. |

Left in place: `gist.github.com/spikeheap/9162189#gistcomment-1435948` in `2014-02-22-open-data-day-2014.md` — this is an attribution hyperlink to a third-party commenter, not an embed. No build-time fetch involved.

### Tweets

The original embeds already contained the tweet text in the `<blockquote class="twitter-tweet">` markup. Each was rewritten to a semantic `<blockquote class="tweet-archive">` with `cite` attribute, attribution `<footer>`, and machine-readable `<time>` element. The `platform.twitter.com/widgets.js` script tags were removed.

| Tweet ID | Author | Date | Post |
| --- | --- | --- | --- |
| `503178382201618433` | Alan Shaw (@_alanshaw) | 2014-08-23 | `2014-08-27-jsoxford-nodebots-day.md` |
| `586953688041816065` | JSOxford (@JSOxford) | 2015-04-11 | `2020-04-11-running-a-remote-hack-day.md` |
| `999964355931197440` | Elastic (@elastic) | 2018-05-25 | `2018-06-01-security-is-not-a-pro-feature-151eec09fdfa.md` |

Hashtag and @-mention links inside the tweet bodies were flattened to plain text — they pointed at `twitter.com/hashtag/...` and `twitter.com/...` which add no value beyond the archived text. The link to the original tweet (used for attribution) was preserved.

Tweet 2 contained `pic.twitter.com/wpwLOMp4Te` referencing an attached image — the t.co wrapper and image are gone with Twitter's URL-shortener decay. The bare reference is preserved as plain text for historical accuracy.

### YouTube and other embeds

No action required. All YouTube references in the corpus are plain hyperlinks (`<a href="https://youtube.com/...">`), not iframes or embed scripts. No third-party loads happen at render time.

### Verification

- `grep "twitter-tweet" src/_posts/` → no matches
- `grep "platform.twitter" src/_posts/` → no matches
- `grep "{% gist" src/_posts/` → no matches
- `grep "<iframe" src/_posts/` → no matches
- All three tweet IDs present in built HTML (`cite=` + `href=` per post)

## Phase 1a — Jekyll removal

Goal: strip the repo back to content + tests so Bridgetown is wired into a clean foundation, not layered on top of Jekyll detritus. Intermediate state — the site does not build between Phase 1a and Phase 1b.

### Removed

| Path | Reason |
| --- | --- |
| `Gemfile`, `Gemfile.lock` | Jekyll dependency manifest. Bridgetown will have its own. |
| `_config.yml`, `_config.build.yml` | Jekyll configuration. |
| `_site/`, `.jekyll-cache/` | Generated build output and cache (gitignored). |
| `bin/deploy.sh` | Pushed Jekyll build to a `generated_site` branch — replaced by GitHub Actions in a later step. |
| `.circleci/` | Jekyll-specific CI config. Replacing with GitHub Actions. |
| `.devcontainer/` | Devcontainer Dockerfile ran `bundle install` against the dead Gemfile. Cleaner to re-add fresh if needed. |
| `.ruby-lsp/` | LSP caches tied to the Jekyll Gemfile (not git-tracked; disk cleanup only). |
| `src/_includes/social-share.html` | Liquid override for the minimal-mistakes theme. Theme removed; partial irrelevant. |

### Kept

All content under `src/` (posts, pages, drafts, data, images, well-known, CNAME, keybase.txt, index.html) including their frontmatter — Bridgetown reads the same `_posts/_pages/_data/` collection paths and most YAML frontmatter ports across cleanly. Frontmatter values that reference Jekyll layout names (`layout: single`, `layout: posts`, `layout: home`, `layout: tags`) stay in place and will be re-mapped to Bridgetown layouts in Phase 1b.

The Playwright test suite (`tests/`, `playwright.config.ts`, `package.json`) is engine-agnostic and stays as-is. It will fail to run against this intermediate state because there is no server to test against; it will be re-pointed at the Bridgetown dev server in Phase 1b.

Generic tooling kept: `.editorconfig`, `.gitattributes`, `.gitignore`, `.tool-versions` (Ruby 3.3.1 is fine for Bridgetown 2.x), `.pre-commit-config.yaml`.

### Verification

- `ls` of repo root contains no Jekyll files
- All 58 dash-format posts present in `src/_posts/`
- All 53 image files present in `src/images/`
- All 5 page files present in `src/_pages/` (now, prev, posts, tag-archive, 404)

## Phase 1b — Bridgetown skeleton + minimum viable shell

Goal: Bridgetown 2.x serving the existing content with permalinks preserved and the Playwright suite green. Visual fidelity not a goal — Phase 2 will redesign.

### Plugins added (Ruby)

| Plugin | Why |
| --- | --- |
| `bridgetown ~> 2.0` | Engine. |
| `puma ~> 6.0` | Local dev server (Bridgetown 2.x uses Roda + Puma). |

No other gems. Sitemap, feed, redirects, gallery component, post archive, tag archive are all hand-rolled in-tree.

### Repo additions

| Path | Role |
| --- | --- |
| `bridgetown.config.yml` | Site config. Uses `template_engine: liquid` so post Markdown isn't ERB-parsed (a few code blocks contain `<%= %>` as example markup). |
| `config/initializers.rb` | Registers a custom `:dated_slug` permalink placeholder. Bridgetown segments permalinks by `/`, so the legacy `/posts/YYYY-MM-DD-slug` shape needs a single token. |
| `config/puma.rb` | Standard Puma config from the Bridgetown 2.x template. |
| `config.ru` | Rack entry point. |
| `server/roda_app.rb` | Roda app. Includes a route override that prefers `<file>.html` over `<file>/index.html` to match GitHub Pages' precedence — Bridgetown's SSG plugin defaults the other way, which causes redirect stubs to shadow canonical pages. |
| `Rakefile` | Loads Bridgetown rake tasks. |
| `src/_data/site_metadata.yml` | Title, description, locale, etc. — Bridgetown reads metadata from this path rather than top-level config. |
| `src/_layouts/default.erb` | Base shell — head, nav, footer. |
| `src/_layouts/post.erb` | Wraps posts with h1, date, tag list. |
| `src/_layouts/page.erb` | Generic page wrapper. |
| `src/_layouts/home.erb` | Homepage — recent posts list. |
| `src/_layouts/posts_by_year.erb` | `/posts-by-year` archive. |
| `src/_layouts/tag_archive.erb` | `/tags` archive, normalising both `tags:` (array) and `tag:` (singular) frontmatter. |
| `src/_components/gallery.liquid` | Minimal replacement for minimal-mistakes' gallery include — used by one post. |
| `src/syntax.css` | Rouge-generated GitHub-flavour highlight stylesheet. |
| `src/feed.xml.erb`, `src/sitemap.xml.erb`, `src/robots.txt.erb` | Hand-rolled, no plugin. |
| `plugins/site_builder.rb` | Base class for builders. |
| `plugins/builders/redirects.rb` | Replaces `jekyll-redirect-from`. For each resource carrying `redirect_from:`, generates a meta-refresh + JS + canonical + noindex stub at the listed URL. Targets are absolute. |

### Permalinks

| Resource | Pattern | Produces file at | Canonical URL |
| --- | --- | --- | --- |
| Post | `/posts/:dated_slug.*` | `output/posts/<date>-<slug>.html` | `/posts/<date>-<slug>` |
| Page | `permalink: /now.html` (explicit) | `output/now.html` | `/now` |
| Redirect stub | `permalink: /now/` (synthetic) | `output/now/index.html` | (serves the stub) |

### Content adjustments forced by Bridgetown

- One post (`2021-08-09-raphas-free-repair-service-...md`) used `{% include gallery id="..." %}` — minimal-mistakes' theme include. Liquid 5.x is stricter than Jekyll's flavour: filename must be quoted and bare (no extension). Updated to `{% include "gallery" id="..." %}`.
- Pages with `layout: single`, `posts`, `tags` mapped to new layouts (`page`, `posts_by_year`, `tag_archive`).
- All page permalinks updated to `.html` form for explicit file output (matching post canonical shape).

### Test suite changes

- `tests/images.spec.ts`: `request.head()` → `request.get(maxRedirects: 0)`. Bridgetown's SSG plugin only routes GET; GH Pages serves both.
- `tests/permalinks.spec.ts`: `normaliseText()` extended to decode HTML entities (`&#39;` → `'` etc.) — Bridgetown's ERB auto-escapes titles in `<title>` and `<h1>`, where Jekyll's Liquid rendered the smart-quote glyph directly.

### Result

`npm test` against `bundle exec bridgetown start` → **149 passed, 5 skipped, 0 failed**, matching the Jekyll baseline exactly. The 5 skipped tests are the `fixme`'d post-trailing-slash cases (per the README's "slashes optional" aspiration, not yet implemented for posts).

## Phase 1c — Surface the four underscore-prefixed posts

Goal: bring the four `YYYY-MM-DD_…` files into the standard `YYYY-MM-DD-…` form so they publish properly. Jekyll silently dropped them; Bridgetown is permissive enough to publish them, but the URLs it produced (via slugification) weren't consistent with the rest of the corpus. None of these were ever public, so renaming is free.

### Renames

| Before | After |
| --- | --- |
| `2015-09-11_full_stack_fest_accessiblity.md` | `2015-09-11-full-stack-fest-accessibility.md` (typo fixed in filename) |
| `2018-07-31_Invest-in-internal-tooling-8bf038e45e07.md` | `2018-07-31-invest-in-internal-tooling-8bf038e45e07.md` |
| `2019-06-13_Lessons-learned-from-the-NPD-Find---Explore-project-6b044649b165.md` | `2019-06-13-lessons-learned-from-the-npd-find-explore-project-6b044649b165.md` (triple-dash from `&` collapsed) |
| `2020-11-27_Generic-names-are-a-smell-9357f0380b91.md` | `2020-11-27-generic-names-are-a-smell-9357f0380b91.md` |

Also removed the stale Medium-style `slug:` frontmatter from the two posts that carried it — those values were Medium platform URLs (`/@spikeheap/…`), no longer meaningful.

### Result

Test suite now covers all 62 published posts: **157 passed, 5 skipped, 0 failed**. (149 baseline + 8 new tests, two per renamed post.)

## Phase 1d — GitHub Actions for CI and deploy

Goal: replace the deleted CircleCI config with GitHub Actions. PR builds run the test suite; pushes to `main` build and deploy to GitHub Pages.

### Workflow shape

Single file at `.github/workflows/ci.yml` with two jobs:

- **`test`** — runs on PR and push. Sets up Ruby + Node, restores Bundler/npm/Playwright caches, starts `bridgetown start` in the background, waits up to 30s for the server to come up on `localhost:4000`, then runs `npm test`. Uploads the Playwright HTML report on failure.
- **`deploy`** — runs only on push to `main`, gated on `test` passing. Production build (`BRIDGETOWN_ENV=production`), then uploads `output/` via `actions/upload-pages-artifact@v3` and publishes with `actions/deploy-pages@v4`. Concurrency group `pages-deploy` queues simultaneous pushes and never cancels in-flight deploys (to avoid partial publishes).

### One-time repo setting

GitHub Pages needs to be switched from "Deploy from a branch" to **"GitHub Actions"** in Settings → Pages. The previous Jekyll pipeline pushed builds to a `generated_site` branch; the new pipeline uses the Pages deploy action directly. Without this flip, the workflow will run but the live site won't update.

### Deliberate omissions

- No production-against-localhost smoke test in CI. Run `BASE_URL=https://ryanbrooks.co.uk npm test` manually post-deploy if you want it.
- No visual regression — covered by manual QA per the original plan.
- No npm cache for Playwright browsers in a separate action — `actions/cache@v4` keyed on `package-lock.json` does this directly.

## Phase 2a — UI redesign (typography-led, accessibility-first)

Goal: replace the minimum-viable shell from Phase 1b with a redesign that prioritises readability and accessibility. Direction agreed in conversation: typography-led / minimal chrome, system fonts only, warm-neutral palette with a burnt-amber accent, dark mode toggle, microformats2 markup folded into templates.

### Design system

All tokens live in `src/styles.css` as CSS custom properties so future hue/contrast iteration is one edit.

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--color-bg` | `#faf6f0` | `#1c1a18` | Warm off-white / warm charcoal |
| `--color-text` | `#1f1d1b` | `#ede6dc` | 14.6:1 / 14.1:1 — AAA |
| `--color-muted` | `#6b6863` | `#98908a` | 5.5:1 — AA |
| `--color-accent` | `#b45309` | `#fb923c` | Burnt amber / warm orange, 5.7:1 / 9.1:1 |

The accent sits in the yellow-orange band, distinct from anything red — safe distance from red/green for protanopia/deuteranopia.

- **Fonts:** zero web fonts. Headings use a system serif stack (Iowan Old Style → Apple Garamond → Baskerville → Times New Roman → Georgia); body uses `system-ui`; code uses `ui-monospace`. The serif-headings + sans-body pairing is the signature move borrowed from Unplanned Obsolescence.
- **Type scale:** 1.25 ratio off 17px base. Body line-height 1.6; heading line-height 1.2.
- **Reading column:** 65ch (~720px). Slightly wider than typical for comfortable reading at 17px.
- **Spacing:** 4-based scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96).

### Dark mode

- Inline `<script>` in `<head>` applies the persisted `theme` from `localStorage` before first paint — no FOUC.
- `@media (prefers-color-scheme: dark)` provides the no-preference default scoped to `:root:not([data-theme])`.
- Visible toggle in the site header (sun/moon SVG icons swapped via CSS based on `data-theme`).
- `aria-pressed` reflects state for screen readers; `aria-label="Toggle dark mode"` always says what the button does.

### Accessibility wins folded in here

- Skip link to `#main`, visible only on focus.
- `:focus-visible` outline using the accent colour with 2px offset.
- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav aria-label="Primary">`).
- `prefers-reduced-motion` disables transitions.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body paragraphs.
- All body and heading contrast passes WCAG AAA; muted text and accent pass AA.

### Microformats2 / IndieWeb

Folded into templates (closes the "Fix Indieweb rel=me" todo):

- Posts wrapped in `<article class="h-entry">` with `p-name`, `dt-published`, `e-content`, `p-category` (tags), `u-url`.
- Author marked with `p-author h-card` in the footer.
- `rel="me"` on Mastodon and GitHub footer links — enables Mastodon profile verification once deployed.

### Syntax highlighting

After two iterations on Rouge-generated themes (github → solarized), settled on a hand-written CSS palette tuned for our warm-cream / warm-charcoal code-block backgrounds. Rouge's stock themes are tuned for their own reference backgrounds — `base16.solarized.light` colours (e.g. `#b58900` yellow, `#859900` green, `#2aa198` cyan) drop below AA contrast (2.7:1 to 3.4:1) on our slightly-darker `#f0eae3`, so even with the spans wrapped correctly the highlighting reads as "nothing happened". Solarized also includes hard reds (`#dc322f`) which conflict with red-green colour blindness.

The custom palette in `src/syntax.css` covers all common Rouge token classes (comments, keywords, strings, built-ins/functions/classes/decorators, attributes, numbers, operators, diff markers, errors) in two themes (light + dark). Every colour passes AA (≥4.5:1) on the relevant code-block background. No red/green pairings; the only red is the error token, which is also italic + wavy-underlined so colour isn't the sole cue. Diff additions/deletions get colour + background tint + the `+/-` glyph already present in source.

Approximate light-mode contrasts on `#f0eae3`:

| Role | Hex | Contrast |
| --- | --- | --- |
| Comments (italic) | `#6e5f4e` | ~5.5:1 |
| Keywords (bold) | `#1f3f6b` | ~10:1 |
| Strings | `#4d5a26` | ~7:1 |
| Built-ins | `#92400e` | ~6:1 |
| Numbers | `#5b3f8c` | ~7:1 |

> ⚠️ Historical note: when generating Rouge-themed CSS, `rougify --scope` pastes its argument *literally* before each rule. Don't pass a comma-separated list — CSS will parse "A, B .k" as "the whole of A (no .k) plus B .k", so only half the scope will match. Caught this between iterations; not relevant any more now that the file is hand-written.

### Page weight

A post page (HTML + CSS + syntax CSS) is ~34 KB uncompressed → ~8–12 KB gzipped. Zero web fonts, zero external scripts, zero third-party assets. Lighthouse should report green across the board.

### Tests

Added `tests/dark-mode.spec.ts` covering: OS preference applies on first load with no localStorage; clicking the toggle flips theme and writes to localStorage; persisted preference re-applies on reload before paint (FOUC-safe). All 157 existing tests still pass.

**Suite total: 160 passed, 5 skipped, 0 failed.**

### Follow-ups still open

- **Lighthouse budget check in CI** — useful as a perf regression guard once we know the baseline.
- **Web font experimentation** — start with zero per agreement; revisit if the all-system look feels generic. The design tokens make swapping in `--font-serif` trivial.
- **Tag ontology review** (see README todo) — current tags are inconsistent (`tag:`/`tags:` mix, organic vocabulary). Worth standardising before relying on tag-based navigation.

## Phase 2b — Design iteration after first visual review

Goal: address visual feedback from running the redesigned site locally — duplicated chrome, missing avatar, broken caption rendering, mobile layout regression. Added axe-core to catch future a11y regressions automatically.

### Changes

| Concern | Fix |
| --- | --- |
| Description duplicated content in post body | Removed from `post.erb`. The `<meta name="description">` in `<head>` still uses it for SEO snippets. |
| Image captions in Medium-imported posts rendered as paragraphs | Converted 8 instances across `2021-07-30-…` and `2021-09-08-…` to `<figure><figcaption>` with separate alt text and caption text. Added general `figure`/`figcaption` styling. |
| Homepage had duplicate site title (header link + page H1) | Header link now shows `site.metadata.author` ("Ryan Brooks") instead of full site title — shorter for mobile too. Page H1 rewritten as "Hi, I'm Ryan." greeting. Avatar restored as a circular 120px (96px on mobile) `<img>`. The `h-card` microformat wraps the intro for IndieWeb identity. |
| Light/dark toggle wrapped to a second row at narrow viewports | Header CSS now uses `gap: var(--space-2) var(--space-4)` and a media query at `max-width: 640px` that sets `.site-nav { order: 99; flex: 1 1 100% }` — at narrow widths the nav stacks below as a full row while the title + toggle stay anchored on the top row. |
| Inline `<code>` inside a link failed AA contrast (accent text on muted background = 4.2:1) | `a code { background: transparent; padding: 0 }` — inside a link the code becomes plain text styled as a link. |

### axe-core added

`@axe-core/playwright` integrated into the suite (`tests/a11y.spec.ts`). One test per representative page (homepage, post-with-code, archive, tag archive); each runs axe with `wcag2a/wcag2aa/wcag21a/wcag21aa` tags. Filters violations to serious + critical only. Excludes `.highlight` blocks because per-token syntax-highlighting contrast is the recognised exception — the base code text still passes against the page background.

Caught two real issues on the first run (the inline-code-in-link contrast and the Solarized-on-tinted-bg tokens) — fixed before commit.

### Test totals

**164 passed, 5 skipped, 0 failed** — 160 previous + 4 a11y smoke tests.

### Post-axe WAVE pass

WAVE flagged a hidden empty link in `post.erb` (`<a class="u-url" hidden></a>` — my initial microformats2 hack). Replaced with a visible self-link wrapping the date: `<a class="u-url" rel="bookmark"><time>…</time></a>`. Better practice (date as permalink is a common, useful pattern) and still satisfies the h-entry parser.

axe didn't catch this — `hidden` makes the element effectively non-existent to axe's checks, but WAVE treats it as a fragile pattern.

## Phase 3a — Mastodon comments

Goal: posts that have been tooted can carry an optional `mastodon:` frontmatter field pointing at the originating toot URL. The post page then renders a Comments section that fetches the thread client-side and displays counts + threaded replies. No-JS visitors get a static "View the conversation on Mastodon" link.

### Files added

| Path | Role |
| --- | --- |
| `src/comments.js` | Vanilla JS (~140 lines). Parses the toot URL, fetches `/api/v1/statuses/<id>` for counts and `/api/v1/statuses/<id>/context` for the descendant list, rebuilds the reply tree from `in_reply_to_id` chains, hydrates the link text with counts and renders nested `<ol>` lists of replies. Trusts Mastodon's server-sanitised content HTML; fails silently if the API is unreachable (the static fallback link still works). |
| `tests/comments.spec.ts` | Uses `page.route` to mock Mastodon API responses and `page.setContent` + `page.addScriptTag({ path: 'src/comments.js' })` to inject synthetic markup — avoids polluting real posts with placeholder toot URLs. |

### Files updated

- `src/_layouts/post.erb` — conditionally renders the comments section and loads `comments.js` when `resource.data.mastodon` is set. No-JS fallback link is always present; the empty `<ol class="comments__list" hidden>` is unhidden by JS once replies have been appended.
- `src/styles.css` — comments section, nested reply threading (`.comments__list .comments__list { padding-inline-start; border-inline-start: 2px solid; }`), avatar + handle + permalink meta line.

### Trust + safety

Mastodon's API returns content as already-sanitised HTML (server-side strip of scripts; only `<p>`, `<br>`, `<a>`, `<span>` are allowed through). We trust that and use `innerHTML` for reply bodies. The trust boundary is the chosen instance — if the instance is compromised, comments are not the largest concern.

External links inside comments (author profile, reply permalink) get `rel="noopener"`.

### Tests

| Test | What it verifies |
| --- | --- |
| No-JS fallback link is visible before hydration | The `<a class="comments__link">` carries the toot URL and the static "View the conversation on Mastodon" text even when the API is blocked. The reply list stays hidden. |
| Hydrates link text with counts and renders threaded replies | With mocked API responses (2 descendants, one nested), the link text becomes "View 2 replies, 5 boosts and 12 favourites on Mastodon", the list unhides, and the tree has exactly one top-level reply with one nested child. |
| Singular vs plural in count text | "1 reply" not "1 replies"; zero counts omitted entirely. |
| Posts without `mastodon:` frontmatter have no comments section | DOM has zero `.comments` elements on a regular post. |

### Result

**168 passed, 5 skipped, 0 failed.** Suite up from 164 → 168 (four new comments tests).

### How to use on a real post

```yaml
---
title: "..."
date: 2026-06-01
mastodon: https://ruby.social/@spikeheap/<toot-id>
---
```

That's it. The section appears, the fallback link works without JS, the thread loads with JS. No deploy-time step.

## Phase 3b — Webmentions via webmention.io

Goal: receive webmentions from anywhere on the IndieWeb, render likes/reposts as compact avatar facepiles and replies/mentions as comment cards. Sending outbound webmentions is delegated to webmention.app (no build-time code needed).

### Files added

| Path | Role |
| --- | --- |
| `src/webmentions.js` | Vanilla JS (~140 lines). Reads the post URL from `data-webmentions-target`, fetches `https://webmention.io/api/mentions.jf2?target=…`, groups results by `wm-property`, renders likes/reposts/bookmarks as facepiles and `in-reply-to` + `mention-of` as comment cards. Reuses the `.comment` styling from Phase 3a for replies. Section stays hidden when there are no mentions. |
| `tests/webmentions.spec.ts` | Four tests covering empty result, facepile rendering, reply card rendering, and a mixed scenario — uses `page.route` to mock the jf2 endpoint. |

### Files updated

- `src/_data/site_metadata.yml` — new `webmention_endpoint` field (set to `https://webmention.io/ryanbrooks.co.uk/webmention`).
- `src/_layouts/default.erb` — emits `<link rel="webmention" href="…">` in `<head>` when the endpoint is configured.
- `src/_layouts/post.erb` — conditionally renders the empty webmentions section + loads `webmentions.js` deferred.
- `src/styles.css` — `.webmentions` wrapper, `.facepile` (flex row of circular avatars, 32px, with hover scale), `.webmentions__replies-heading` (small label).
- `README.md` — "Webmentions" section explaining the registered endpoint, the build-time hook points (link rel + section render), and that outbound sending is via webmention.app pointed at the RSS feed.

### Trust + safety

webmention.io sanitises reply HTML server-side (same posture as Mastodon's API), so we use `innerHTML` for content. All author and permalink links open in new tabs with `rel="noopener noreferrer"`.

### One-time setup the user owns

1. Sign in to webmention.io with `ryanbrooks.co.uk` via IndieAuth (already done).

After that, the site auto-renders incoming mentions on each post — no deploy step per post.

### Deferred to follow-up

- **Outbound webmention sending** when posts link to other IndieWeb sites. Original plan was webmention.app's free tier (RSS polling), but the user opted to self-host via a GitHub Actions step instead — see README todo for the implementation sketch. Means posts linking to other people's sites currently *don't* notify those sites; not a regression (the previous Jekyll site never did either).
- **Bridgy** for bridging Mastodon reactions into webmention.io. Without it, Mastodon reactions only appear in the Phase 3a Comments section (the toot's own thread), not the Phase 3b Webmentions section. See README todo.

### Test totals

**175 passed, 5 skipped, 0 failed** — 171 previous + 4 new webmention tests.

## Phase 4 — CV revamp

Goal: replace the single hand-written `/prev` page with a tagged dataset and three rendered views — a technical-leadership CV, a security-leadership CV, and a fractional-CTO/CISO consultancy page — driven from a single source of truth.

### Why

The previous `/prev` page was a long single document blending CV-style experience, community work and talks, last updated in 2022. It diverged from the LinkedIn profile and the Google Docs PDF (`2025-07 Ryan Brooks CV.pdf`), and didn't shape itself to the three role flavours Ryan is positioning for. The plan was to consolidate sources, structure the data, and let the site render variants instead of maintaining parallel documents.

### Sources reconciled

| Source | Role |
| --- | --- |
| `src/_pages/prev.md` (Jekyll-era) | Older long-form content; longest community / talks / events lists. |
| `2025-07 Ryan Brooks CV.pdf` | Most current narrative voice; richest Hackney bullets; CISO-flavoured personal statement. |
| LinkedIn experience section (May 2026) | Authoritative for dates and most recent two roles (Public Group, Goodbase). |

Reconciliation notes captured inline in `src/_data/cv.yml` as `TODO:` markers where sources disagree (Slate Horse end date; Compliance Testing Laboratory start).

### Files added

| Path | Role |
| --- | --- |
| `src/_data/cv.yml` | Single source of truth: profile (with `print_only` phone/email block), three personal `statements`, 11 `experience` entries (each tagged `audiences: [tech_leadership, security_leadership, consultancy]` and supporting per-view `titles` overrides + per-bullet audience filtering), `career_history` tail for pre-2012 roles, `certifications`, `education`, `community`, `talks`, `events`, three per-view `skills` keyword lists, and a `consultancy` block (intro, services, case studies, sector-grouped logo wall, contact). |
| `src/_layouts/cv.erb` | Renders a CV view selected by `resource.data.view` ("tech_leadership" or "security_leadership"). Filters experience and bullets by audience tag, picks the matching statement and skills list, and surfaces a contextual switcher between the two views. Phone/email live in a `.print-only` block, surfaced only by the print stylesheet. |
| `src/_layouts/services.erb` | Consultancy page: friendly intro, fractional-CxO services, recent engagements (joined to `experience` entries by `id`), sector-grouped logo wall, "let's talk" CTA. |
| `src/_pages/cv.md` | `permalink: /cv.html`, `view: tech_leadership`. Carries `redirect_from: [/cv/, /prev/, /prev.html]` so the existing redirect builder generates stubs for all the old URLs. |
| `src/_pages/cv-security.md` | `permalink: /cv/security.html`, `view: security_leadership`. |
| `src/_pages/services.md` | `permalink: /services.html`. |

### Files updated

- `plugins/builders/helpers.rb` — new `month_year(value)` helper that normalises "YYYY-MM", "YYYY-MM-DD", "YYYY", "present" and empty input into a recruiter-readable "Mon YYYY" string (or "present" / the year alone where appropriate).
- `src/_layouts/default.erb` — primary nav: dropped "Previously", added "CV" and "Services".
- `src/_data/navigation.yml` — same change, in case anything later renders the nav from data.
- `src/styles.css` — added a CV section (`.cv__*`, `.role*`), a services section (`.services__*`, `.service`, `.case-study`, `.logo-wall`), a `.print-only` utility, a `@media print` block that forces a white background, hides site chrome/no-print elements, tightens the type scale, and a `@page { size: A4; margin: 18mm 16mm; }` rule for PDF output.
- `tests/helpers/fixtures.ts` — `/prev` replaced with `/cv`, `/cv/security` and `/services` in `TOP_LEVEL_PAGES`.
- `tests/internal-links.spec.ts` — seed list updated similarly.

### Files removed

- `src/_pages/prev.md` — content lives in `src/_data/cv.yml` now; the URL is preserved by the redirect builder via `redirect_from` on `cv.md`.

### URL plan

| URL | Status |
| --- | --- |
| `/cv`, `/cv.html` | Tech-leadership CV (default). |
| `/cv/`, `/prev`, `/prev.html`, `/prev/` | Redirect to `/cv.html` via the `Builders::Redirects` builder. |
| `/cv/security`, `/cv/security.html` | Security-leadership CV. |
| `/cv/security/` | Redirect to `/cv/security.html`. |
| `/services`, `/services.html` | Consultancy page. |
| `/services/` | Redirect to `/services.html`. |

### Privacy / print-only contact

The phone number and personal email live in `profile.print_only` and render only inside `.print-only`, which `@media print` reveals. Surfacing them on the public site is gated on the repo going private and hosting moving to Netlify — handled separately, before the next public deploy.

### Deferred

- The `cv.yml` carries `TODO:` markers for Slate Horse Ltd end date (LinkedIn says Jan 2020; older `prev.md` said Jan 2021) and Compliance Testing Laboratory start (LinkedIn shows internally inconsistent dates). Both are minor and don't gate publishing.
- Logo wall is currently text-in-cards. Real logos can drop in later — the data model accepts a `logo` field on each entry without a layout change.
