---
layout: post
tags: ['post', 'blogging','jekyll']
title: "An (almost) utopian Jekyll setup, the old version"
comments: false
---
[Jekyll](http://www.jekyllrb.com) is a powerful static site generator and is baked into GitHub pages to provide a pretty straightfoward mechanism to host static sites for free. Jekyll on GitHub has some limitations, so here I describe how to automatically build the site with Travis so we can take advantage of some of the more advanced features of Jekyll and wrap it into a more complete web workflow.

<!-- more -->

#### Rationale
As a professional software developer I'm used to complex build workflows: linting, compiling, concatenating and minifying JavaScript and SCSS, optimising images, running tests, etc., so when I'm developing the blog I want access to the same tooling.

Recently Jekyll added (Sass support)[TODO_link] within GitHub pages, so it seemed like a great time to migrate to Jekyll, which I use for a couple of other projects. Besides, migrating a blog onto a new platform is a great way to procrastinate and put off actually writing anything. Pretty quickly I started running into errors, particularly the exceedingly helpful

TODO FIX blockquote!

> The page build failed with the following error:
>
>The file `css/style.scss` contains syntax errors. For more information, see https://help.github.com/articles/page-build-failed-markdown-errors.
> 
> If you have any questions please contact us at https://github.com/contact.

which is a bit frustrating when there aren't any errors in the SCSS. A quick back-and-forth with GitHub support didn't resolve the issue, and there's no access to the GitHub build, which pulled me back to a golden rule: always develop on as close to a mirror of production as possible. 

The site was building fine locally, so let's build manually, and then push static HTML to GitHub Pages. All we need is [Travis](http://www.travis-ci.org) to build our site every time we push a change to GitHub. Once we've got that, it's straightforward to add the ability to schedule posts to be published in the future and add a mailing list with Twitter/Facebook notifications.

#### Building the site locally

- GH branch
- Gemfile (robwierzbowski)

#### Building the site automatically
TODO
  * CSS & JS preprocessing 

#### Automatically deploying the site
TODO
  * Travis build to push to GitHub hosting

#### Scheduled posts
TODO
  - drafts
  - publish with a future date
  - TRON-CI

#### Bonus card: mailing list notifications

TODO add Gist to feed.xml

[MailChimp](http://www.mailchimp.com) offers free RSS-powered mailing campaigns, which we can leverage to notify our readers of new posts. Adding this to the site involves three things:

1. Add an RSS feed to the site.
2. Create a MailChimp campaign to send emails based on that RSS feed.
3. Add a mailing list subscription button to the site

##### Building an RSS feed
TODO

##### The MailChimp campaign
TODO
  - Sign up for MailChimp
  - Create an "RSS-Driven campaign"

##### Adding a sign-up button
TODO

#### Summary
TODO
- Free


* next steps
  - add grunt tasks for jekyll-compose
