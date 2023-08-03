This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

[![CircleCI](https://circleci.com/gh/spikeheap/spikeheap.github.io/tree/master.svg?style=svg&circle-token=8edb71cdbc67172916f5283acc2be17f59585f38)](https://circleci.com/gh/spikeheap/spikeheap.github.io)

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request.

If you just disagree with me, let's talk about it in the comments.

## To do

- [ ] Add /now page
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

## Authoring notes

### Embedded tweets

To embed a Tweet use the "Embed tweet" snippet from Twitter's website.

## Developing locally

```
bundle exec jekyll serve --livereload
```

##  Deploying to GitHub pages

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

## Importing from Medium

Let's face it, I write too infrequently for this to be automated. To import a post from Medium:

1. Use `medium-to-markdown` (or one of the other variants) to convert the HTML to markdown.
2. Download images and update links to be local
3. Update tweets to use Twitter embeds

## Requirements when considering alternatives

1. Honour permalinks from days gone by. The format for links is https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
2. Slashes are optional. The following could both exist in the wild.
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
3. Github-flavour markdown, including code blocks, are present in posts.
4. Code blocks must be syntax highlighted!
5. Tweets are included using <Tweet id="idxxxxxx"></Tweet>
