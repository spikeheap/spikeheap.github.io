---
layout: post
tags: ['post', 'Grails', 'software', 'development', 'programming']
title: "Disqus comment threads on a docpad homepage"
date: 2014-02-27 18:58:40 +0000
comments: true
published: true
---
I really do get on well with [docpad](http://docpad.org/). Adding comments to the homepage blog entry was a little tricky though, so here's the workaround I applied.

<!-- more -->

Despite wanting to move to a JVM-based static site generator, docpad does too many things to make me want to leave. It's not perfect, but it has plugins to solve mosts of your basic problems, and is nicely hackable. Plus it's written in CoffeScript, which is always a plus.  The [services plugin](https://github.com/docpad/docpad-plugin-services) provides a neat way to inject Disqus comment threads into your pages. It's almost zero configuration and works reliably, but it doesn't work when you're rendering dynamic content, for example the latest blog post on your home page. 

Everything worked well until Disqus got confused. First it displayed the comments from a blog post on the homepage when it was no longer correct. Then it just started displaying the comment thread on all pages which didn't have their own threads already. Not so good. 

Fortunately Disqus support were very responsive, and got back to me explaining the problem: the Disqus widget doesn't just need the title, it also needs a unique URL in its config. The services plugin doesn't work for this, as it always gets the current page URL, so here's a modified version of [the original script](https://github.com/docpad/docpad-plugin-services/blob/master/src/services.plugin.coffee#L356) which takes a post as a parameter so you can load dynamic comment threads wherever you like.

All you need to do is add the following to your `docpad.cofee`, I put it in the helpers section:

{% gist spikeheap/9256629 docpad.coffee %}

Then you can add the comments to your index page, like so:

{% gist spikeheap/9256629 index.html.eco %}

I will submit this as a pull request just as soon as I figure out how to do it elegantly :), but this will do as a workaround for now.