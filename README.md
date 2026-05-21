This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

> ⚠️ **Mid-migration.** This branch (`phase-1-bridgetown`) is rebuilding the site on Bridgetown 2.x. Engine, permalinks and tests are in place; UI redesign + indieweb still to come. See `MIGRATION.md` for context.

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request.

If you just disagree with me, let's talk about it in the comments.

## To do

- [ ] add st/nd/th to dates in posts list
- [ ] Add `About` page with link to community, e.g. RemoteHack
- [ ] Update homepage to be summary & links off to places
- [ ] Figure out a way to blog short notes about websites & things, inspired by https://maggieappleton.com/garden.
- [ ] Re-add `/tags` to the header nav. Ontology is now curated (see "Tag ontology" below) and the archive splits by topic and form; just needs wiring back into the chrome.
- [ ] Add a "Featured posts" section to the homepage once the site is live and bedded in. Manually-curated permanent surface for the strongest evergreen pieces, alongside "Recent posts". One frontmatter flag (`featured: true`) and a Liquid filter in `home.erb`.
- [ ] WCAG G201 "opens in new tab" indicator on external links. Approach: Bridgetown build-time builder (post-render hook with Nokogiri) following the G201 Example 2 pattern — inline SVG icon + `aria-describedby` referencing a hidden description. Comments JS would carry the same for its dynamic links. Deferred for now to keep complexity down; revisit when the site has been live for a bit.
- [ ] Send outbound webmentions on publish. Avoid webmention.app — implement as a GitHub Actions step in the deploy workflow: diff the changed post files, parse each for absolute outbound `<a href>` values, discover each target's webmention endpoint (HTTP HEAD → Link header, or HTML `<link rel="webmention">`), POST `source` + `target`. The `webmention` Ruby gem handles discovery + send; the workflow step is ~30 lines. Zero third-party dependency for the sending side.
- [ ] Set up [Bridgy](https://brid.gy) to bridge Mastodon reactions into webmention.io. Inbound only — feeds replies/likes/boosts on the toot for a post into the Webmentions section, complementing the Mastodon comments section. Sign up at brid.gy with the same domain. Eventually will need a dedupe pass between the Phase 3a Comments section (toot thread) and the Phase 3b Webmentions section (everything else).

## Tag ontology

Posts carry two tags: one **topic** (`engineering`, `leadership`, `cycling`, `life`, `skiing`) and one **form** (`reference`, `writeup`, `essay`, `event`). The vocabulary lives in `src/_data/tag_taxonomy.yml`; the `/tags` archive groups by topic, then by form.

## Developing locally

```
bundle install
bundle exec bridgetown start
```

Serves at `http://localhost:4000`. Output goes to `output/` (gitignored).

## Scaffolding new content

```bash
# Post — filename is YYYY-MM-DD-<slug>.md; slug derived from title if not given
bundle exec rake post:new title="My new post"
bundle exec rake post:new title="My new post" slug="custom-slug" tags="engineering,update"

# Page — filename is <slug>.md; permalink defaults to /<slug>.html
bundle exec rake page:new title="About me"
bundle exec rake page:new title="About me" permalink="/about.html"
```

Both refuse to overwrite an existing file. Pages default to `layout: page`. Posts include a commented-out `mastodon:` line ready to uncomment once you've tooted the post URL.

## Deploying

GitHub Actions (`.github/workflows/ci.yml`) builds Bridgetown and deploys to GitHub Pages on every push to `main`. PRs run the test suite only.

> ℹ️ One-time setup: in repo Settings → Pages, set **Source** to "GitHub Actions". The legacy "Deploy from a branch" mode won't pick up the new workflow.

## Webmentions

The site receives webmentions via [webmention.io](https://webmention.io). `ryanbrooks.co.uk` is registered there (login with Github, but I should change that).

Two places it hooks into the site:

1. **Build:** `src/_data/site_metadata.yml` carries the endpoint as `webmention_endpoint` which tells other sites where to send mentions. `post.erb` includes the empty Webmentions section + `webmentions.js` on each post page.
2. **Render:** `src/webmentions.js` fetches `https://webmention.io/api/mentions.jf2?target=<post-url>` client-side. Likes and reposts render as compact avatar facepiles; replies and generic mentions render as comment cards (reusing the same `.comment` styling as Mastodon replies).

**Sending outbound webmentions** (when posts link to other people's sites) is not yet implemented — see the todo list. The plan is a small GitHub Actions step in the deploy workflow rather than a third-party service.

## Running the system tests

Playwright suite (`tests/`) that asserts every post permalink, page, feed, image asset, internal link, embedded tweet, and syntax-highlighted code block survives any change to the stack. Designed to run against any backend that serves the site over HTTP.

```
npm install && npx playwright install chromium
npm test
```

To test production (the one that actually matters), use: 

```bash
BASE_URL=https://ryanbrooks.co.uk npm test
```

Make sure not to use the `www.` prefix as it redirects so the tests will end up in a loop.

Spec files map roughly to one concern each: `permalinks`, `trailing-slash` (policy differs between posts and pages), `pages`, `feeds-and-files`, `syntax-highlighting`, `images`, `embedded-content`, `internal-links`, `archives`.

When doing the mandatory "replace the site builder rather than writing a post" thing every couple of years, keep these tests to ensure things don't regress.

## Resizing images

To resize to (e.g.) 900px:

```
npx sharp-cli resize 900 \
  --withoutEnlargement \
  --optimise \
  --progressive \
  --format input \
  --fit inside \
  --input $(find ./docs -name *.jpg -or -name *.png) \
  --output "{dir}/{base}"
```

### Regenerating favicons / apple-touch-icons

`src/favicon-512.png` is the source. The smaller `favicon-16.png` and the three `apple-touch-icon[-NNN]-v2.png` files (180, 152, 167) are derived from it. Regenerate with:

```bash
cd src
for size in 16 152 167 180; do
  case $size in
    16) out="favicon-16.png" ;;
    180) out="apple-touch-icon-v2.png" ;;
    *) out="apple-touch-icon-${size}-v2.png" ;;
  esac
  npx sharp-cli resize $size $size --input favicon-512.png --output "{dir}/$out"
done
```
