This is the personal blog of Ryan Brooks at http://www.ryanbrooks.co.uk. All content in this site are my opinions and not those of my employer or any other organisation I may be affiliated with.

[![CircleCI](https://circleci.com/gh/spikeheap/spikeheap.github.io/tree/master.svg?style=svg&circle-token=8edb71cdbc67172916f5283acc2be17f59585f38)](https://circleci.com/gh/spikeheap/spikeheap.github.io)

Please see the [license](LICENSE.md) to see how you can use the content of this site.

If you've found an error, typo or stylistic faux-pas, please feel free to open an issue or create a pull request. 

If you just disagree with me, let's talk about it in the comments.

## To do

- [x] Update posts template to include title in page
- [x] Move `docs` directory up to root
- [ ] Inline all the `{% gist xxxxx %}` macros
- [ ] Fix links that aren't links (wrap in markdown link syntax)
- [ ] Update homepage to be summary & links off to places
- [ ] Publish to GitHub pages using CircleCI (update job)

- [ ] Add `Mentoring` page with call to action to contact 
- [ ] Add `About` page with link to community, e.g. RemoteHack
- [ ] Create summary/descriptions for each post (automate with pre-`<!-- more -->` block?)
- [ ] Round corners of images and add drop-shadow
- [ ] Add a footer & license (?)


## Requirements when considering alternatives

1. Honour permalinks from days gone by. The format for links is https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
2. Slashes are optional. The following could both exist in the wild.
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy
  - https://ryanbrooks.co.uk/posts/2016-05-19-nginx-docker-proxy/
3. Github-flavour markdown, including code blocks, are present in posts.
4. Code blocks must be syntax highlighted!
4. Posts use gist liquid tags. These will need to be honoured, or updated:
  - `{% gist spikeheap/488929887d22e74783a5f4f982981a84 nginx.conf %}`
5. We denote the short blurb with `<!-- more -->` in posts.