---
layout: post
tags: ['post', 'blogging','jekyll']
title: "An (almost) utopian Jekyll setup for technical blogging"
comments: true
---

Hosted blog sites such as Wordpress have lowered the barrier to entry for blogging and creating online content, but if you've started craving a little more control over your site and its content you've probably looked at [Jekyll](http://jekyllrb.com/). Here's how I use Jekyll to host this blog.

<!--more-->

When I first [moved from Wordpress](https://ryanbrooks.wordpress.com/2013/08/24/ive-moved/) way back in the deep and distant past of 2013 my main motivation was control: control over my content, style and interaction. After meandering through [Octopress](http://octopress.org/) (whose 3.0 development looks really promising), [DocPad](https://docpad.org/) and [Awestruct](http://awestruct.org/) I settled on [Jekyll](http://jekyllrb.com/) because of its community, ubiquity, and because it's written in Ruby so hacking on it isn't too onerous.

My requirements have consistently been: 

1. Be free (as in beer). I don't want to be forced to bring down my site in future because of finances, and I quite like that extra block of cheese I can buy if the site stays free. 
2. Write in Markdown. I'm used to it and its foibles. [Asciidoc](http://asciidoctor.org/) looks promising for longer technical documents, but for shorter posts Markdown has it pretty much nailed. 
3. Build quickly. I spend most of my time in Sublime Text, but when I'm sorting out CSS or image sizes I don't want to have to wait ~30 seconds just to see a trivial change.
4. Build easily, anywhere. I don't want to have to download 1.2Gb of Tex distribution just to compile on a new machine.

#### A starting point: Jekyll & Github pages

GitHub Pages supports Jekyll [out of the box](https://help.github.com/articles/using-jekyll-with-pages/), so it's trivial to [get up and running](http://www.smashingmagazine.com/2014/08/01/build-blog-jekyll-github-pages/).

I quickly hit a limitation with the (then new) SCSS compilation where it would build fine locally but I'd see the following when I pushed to GitHub: 

```
The page build failed with the following error:

The file `css/style.scss` contains syntax errors. For more information, see https://help.github.com/articles/page-build-failed-markdown-errors.
 
If you have any questions please contact us at https://github.com/contact.
```

I also started missing all the things I'm used to in my other projects:

* Macros (e.g. to include Gists in posts)
* Linting
* SCSS/Compass CSS preprocessing
* JS concatenation and minification (and Browserify FTW)
* Image optimisation and resizing

Because GitHub Pages' Jekyll runs in 'safe mode' there's no scope to work any of this in, but build systems such as Grunt and Gulp solve these issues for little overhead.

### Local build with Grunt, SCSS and assets

Rob Wierzbowski has written a great little Yeoman generator which wraps Jekyll with Grunt for build tasks and Bower for dependency management. You can grab it [here](https://github.com/robwierzbowski/generator-jekyllrb).

This is a huge step forward because we now have control of the build steps and can add in extra tasks. This project bundles Compass/Sass compilation so instantly solved my spurious SCSS error issues. 

Switching away from the vanilla Jekyll setup also means we can write plugins and macros, yippee! The downside is that we need to find a new way to host our built site, and preferably a way to build it automatically.

### Github Pages hosting/editing

https://github.com/robwierzbowski/grunt-build-control

-- TODO don't publish drafts
### Custom domains

### A bit more dynamic, though

### Comments

### RSS feeds

### Email feeds




##### An aside - Git branching strategies and drafts, post linking branches


### Working with drafts


### Scheduled posts





### Super bonus points

#### Increase page-speed with a CDN

#### Edit anywhere with Prose.io
