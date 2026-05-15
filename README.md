This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

> ⚠️ **Mid-migration.** This branch (`phase-1-bridgetown`) is rebuilding the site on Bridgetown 2.x. Engine, permalinks and tests are in place; UI redesign + indieweb still to come. See `MIGRATION.md` for context.

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request.

If you just disagree with me, let's talk about it in the comments.

## To do

- [ ] Add webmentions
- [ ] Add `About` page with link to community, e.g. RemoteHack
- [ ] Update homepage to be summary & links off to places
- [ ] Figure out a way to blog short notes about websites & things, inspired by https://maggieappleton.com/garden.
- [ ] Troubleshoot custom domain certs <https://github.com/spikeheap/spikeheap.github.io/settings/pages>
- [ ] Fix Indieweb `rel=me` for site validation on Mastodon
- [x] Reconcile posts and pages different slash rendering
- [ ] Curate tag ontology and re-add `/tags` to the header nav. Current tags (a mix of `tag:` singular and `tags:` array, plus values like `engineering`/`event`/`update`/`rant`) accumulated organically. Decide which to keep, merge, or drop, and standardise on `tags:` as a list. The `/tags` page still builds — it's just been removed from the chrome until this is done.
- [ ] Add a "Featured posts" section to the homepage once the site is live and bedded in. Manually-curated permanent surface for the strongest evergreen pieces, alongside "Recent posts". One frontmatter flag (`featured: true`) and a Liquid filter in `home.erb`.
- [ ] Review use of hero images (are there any that need removing?)

## Developing locally

```
bundle install
bundle exec bridgetown start
```

Serves at `http://localhost:4000`. Output goes to `output/` (gitignored).

## Deploying

GitHub Actions (`.github/workflows/ci.yml`) builds Bridgetown and deploys to GitHub Pages on every push to `main`. PRs run the test suite only.

> ℹ️ One-time setup: in repo Settings → Pages, set **Source** to "GitHub Actions". The legacy "Deploy from a branch" mode won't pick up the new workflow.

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
