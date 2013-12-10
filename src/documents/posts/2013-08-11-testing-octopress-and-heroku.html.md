---
layout: post
tags: ['post']
title: "Testing Octopress and Heroku"
date: 2013-08-11 18:21
comments: true
categories: [technology,git]
---
I have vowed to move away from Wordpress. My blog there, ryanbrooks.wordpress.com, isn't exactly the epitome of regular activity (my last post was back in June) but when I do blog I want it to be easy most of the time and hackable when I'm interested. Enter [Jekyll](http://jekyllrb.com/) and [Octopress](http://octopress.org/). 

TL;DR: Octopress is a tool for building static websites and blogs from plain text files, and allows local development before pushing to your live blog. Best of all, it's designed with Git in mind.
<!--more-->
Rather than reproduce the steps to get up and running (the Octopress site has a wealth of top-notch documentation) I'll just highlight the features which made this worth investigating. Octopress is a framework built on top of Jekyll. Jekyll is the engine which builds your sources into a static site. At this point I'm not sure which feature belongs to which project, so I'm going to lump it all together under the Octopress banner for simplicity.

{% blockquote Octopress http://octopress.org/docs/setup/ %}
First, I want to stress that Octopress is a blogging framework for hackers. You should be comfortable running shell commands and familiar with the basics of Git. If that sounds daunting, Octopress probably isn’t for you.
{% endblockquote %}

This warning at the start of the tutorial gave me a warm fuzzy feeling inside. One thing that has long frustrated me about sites like Wordpress is the ease of use for 95% of tasks, and the near impossibility of the remianing 5%. Reading on, the beauty of Octopress's approach is that the website is static, i.e. there's no database, just a collection of files. This means a couple of things:

* The site can be replicated trivially by putting the files somewhere else, so running a local copy as well is simple. As is deploying a backup. As is copying the files to a minimalist server - [all you need is rsync](http://octopress.org/docs/deploying/rsync/).
* The static files are built locally (or at least that's my current understanding!) before being pushed to [GitHub Pages](http://octopress.org/docs/deploying/github), [Heroku](http://octopress.org/docs/deploying/heroku), or anything else with [rsync](http://octopress.org/docs/deploying/rsync/). This local copy makes a handy staging environment, so you can see your changes before the rest of the world does. You can already do this with Wordpress for content, but that also stands for themes, plugins, extra scripts, anything! 

There's a nice ecosystem of plugins available, including [Flickr integration](https://github.com/neilk/octopress-flickr).

One thing I found myself doing in Wordpress was writing the blog post in TextMate and then copying it into the blog editor, adding links and media and then publishing it. I'm pretty comfortable with markdown so here Octopress cuts out the middle man. *Wordpress does have a mechanism for writing in markdown, but making minor edits after the initial upload sometimes made major changes to the output*.

All in all I'm having a pretty good experience so far. The only potential downside is when I forget to 'push' my changes to make them live, an easy thing to do.