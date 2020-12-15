This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

[![CircleCI](https://circleci.com/gh/spikeheap/spikeheap.github.io/tree/master.svg?style=svg&circle-token=8edb71cdbc67172916f5283acc2be17f59585f38)](https://circleci.com/gh/spikeheap/spikeheap.github.io)

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request. 

If you just disagree with me, let's talk about it in the comments.

## To do

- [ ] Add `Mentoring` page with call to action to contact 
- [ ] Add `About` page with link to community, e.g. RemoteHack
- [ ] Update homepage to be summary & links off to places
- [ ] Add thanks to Vuepress & default theme on site

## Authoring notes

### Embedded tweets

To embed a Tweet we use the custom Vue component:

```html
<Tweet id="xxxxxxx" />
```

## Developing locally

```
npm run dev
```

##  Deploying to GitHub pages

```
./bin/deploy.sh
```

This script automatically pushes the build to the `generated_site` branch.

## Resizing images

- The homepage hero image maxes out at 450px wide. We need 900px to get retina sharpness.
- In-page images are max 740px wide, so we need 1480px for retina.

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
3. Update tweets to use `<Tweet id="xxxxx" />`

## Requirements when considering alternatives

1. Honour permalinks from days gone by. The format for links is https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
2. Slashes are optional. The following could both exist in the wild.
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
3. Github-flavour markdown, including code blocks, are present in posts.
4. Code blocks must be syntax highlighted!
5. Tweets are included using <Tweet id="idxxxxxx"></Tweet>
