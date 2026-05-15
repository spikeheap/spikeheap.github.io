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
