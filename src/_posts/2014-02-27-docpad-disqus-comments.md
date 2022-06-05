---
tags: 
  - engineering
  - guide
title: "Disqus comment threads on a docpad homepage"
date: 2014-02-27 18:58:00+00:00
comments: true
published: true
description: I really do get on well with docpad. Adding comments to the homepage blog entry was a little tricky though, so here's the workaround I applied.
---
I really do get on well with [docpad](http://docpad.org/). Adding comments to the homepage blog entry was a little tricky though, so here's the workaround I applied.

Despite wanting to move to a JVM-based static site generator, docpad does too many things to make me want to leave. It's not perfect, but it has plugins to solve mosts of your basic problems, and is nicely hackable. Plus it's written in CoffeScript, which is always a plus.  The [services plugin](https://github.com/docpad/docpad-plugin-services) provides a neat way to inject Disqus comment threads into your pages. It's almost zero configuration and works reliably, but it doesn't work when you're rendering dynamic content, for example the latest blog post on your home page. 

Everything worked well until Disqus got confused. First it displayed the comments from a blog post on the homepage when it was no longer correct. Then it just started displaying the comment thread on all pages which didn't have their own threads already. Not so good. 

Fortunately Disqus support were very responsive, and got back to me explaining the problem: the Disqus widget doesn't just need the title, it also needs a unique URL in its config. The services plugin doesn't work for this, as it always gets the current page URL, so here's a modified version of [the original script](https://github.com/docpad/docpad-plugin-services/blob/master/src/services.plugin.coffee#L356) which takes a post as a parameter so you can load dynamic comment threads wherever you like.

All you need to do is add the following to your `docpad.cofee`, I put it in the helpers section:

```coffee
getPostDisqus: (post, services) ->
	# Prepare
	services ?= @getServices()
	disqusShortname = services.disqus
	return ''  unless disqusShortname
	disqusDeveloper = if 'production' in @getEnvironments() then '0' else '1'
	pageUrl = (@site.url or '')+post.url
	disqusIdentifier = post.slug
	disqusTitle = post.title or post.name

	# Return
	return """
		<div id="disqus_thread"></div>
		<script>
			(function(){
				window.disqus_shortname = '#{disqusShortname}';
				window.disqus_developer = '#{disqusDeveloper}';
				window.disqus_url = '#{pageUrl}';
				window.disqus_identifier = '#{disqusIdentifier}';
				window.disqus_title = '#{disqusTitle}';
				if ( window.DISQUS ) {
					return DISQUS.reset({
						reload: true,
						config: function () {
							this.page.identifier = window.disqus_identifier;
							this.page.url = window.disqus_url;
							this.page.title = window.disqus_title;
						}
					});
				}
				else {
				  var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
				  dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
				  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
				}
			})();
		</script>
		<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
		<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
		"""
```

Then you can add the comments to your index page, like so:

```html
<% latestPost = @getCollection('posts').toJSON()[0] %>

<article id="latestPost">
	<h1><a href="<%= latestPost.url %>"><%= latestPost.title %></a></h1>
	<t render="markdown"><%- latestPost.content %></t>

	<h2>Comments</h2>
	<%- @getPostDisqus(latestPost) %>
</article>
```

I will submit this as a pull request just as soon as I figure out how to do it elegantly :), but this will do as a workaround for now.
