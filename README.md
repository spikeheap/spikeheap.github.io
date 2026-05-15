This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

[![CircleCI](https://circleci.com/gh/spikeheap/spikeheap.github.io/tree/master.svg?style=svg&circle-token=8edb71cdbc67172916f5283acc2be17f59585f38)](https://circleci.com/gh/spikeheap/spikeheap.github.io)

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request.

If you just disagree with me, let's talk about it in the comments.

## To do

- [ ] Add webmentions
- [ ] Add `About` page with link to community, e.g. RemoteHack
- [ ] Style captions for images "better"
- [ ] Sort out nav - posts by tag, year, ???
- [ ] Update homepage to be summary & links off to places
- [ ] Figure out a way to blog short notes about websites & things
- [ ] Troubleshoot custom domain certs <https://github.com/spikeheap/spikeheap.github.io/settings/pages>
- [ ] Fix Indieweb `rel=me` for site validation on Mastodon
- [ ] Build and deploy with github actions (and remove CircleCI config)
- [ ] fix small font on mobile
- [ ] PR for <https://github.com/jekyll/github-metadata/issues/190>
- [ ] Pull in drafts from
- [ ] Medium
- [ ] Journal
- [ ] Bear
- [x] Reconcile posts and pages different slash rendering

## Developing locally

> ℹ️ Jekyll serves content at localhost:4000.

```
bundle exec jekyll serve --livereload
```

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

##  Deploying to GitHub pages

> ℹ️ This doesn't need to be run locally. The site builds and deploys in CI.

```
./bin/deploy.sh
```

This script automatically pushes the build to the `generated_site` branch.

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
