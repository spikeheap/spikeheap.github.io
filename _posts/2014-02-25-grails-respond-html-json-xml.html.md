---
layout: post
tags: ['post', 'Grails', 'software', 'development', 'programming']
title: "Using Grails respond for HTML, JSON and XML responses"
date: 2014-02-25 17:48:40 +0000
comments: true
published: true
---

The new(ish) support for `respond` in Grails 2.3 is great, and saves us the hassle of specifying different render/response calls depending on the content type. Surpisingly it falters when it comes to returning exceptions and errors, for example `404 NOT FOUND`. This post describes a simple workaround which provides a meaningful response to a JSON/XML request as well as a user-friendly rendered 404 exception for humans.

<!-- more -->

The obvious approach is to respond with the object:

<gist>spikeheap/9213738?file=1_obvious_approach.groovy</gist>

The above works great for basic JSON/XML requests, as it returns a 404 status code and no content. The main problem is that it doesn't render HTML responses, so a user is presented with a blank page. Not so nice.
    

The following will quite happily respond with the correct content type for a valid widget, but if the widget doesn't exist a 404 HTML page and 404 status code are returned (even if you requested JSON/XML):

<gist>spikeheap/9213738?file=2_html_only.groovy</gist>

    
We're almost there, but not quite. We can use the <code>respond</code> method and manually pass back the HTTP status and the view:

<gist>spikeheap/9213738?file=3_working_html_json_xml.groovy</gist>

Hey presto, 404 error pages for HTML users, and a blank 404 response for JSON/XML requests. Obviously the above assumes you have a view named <code>error404.gsp</code> to display a pretty 404 error page.

It might be a bit nicer if our JSON and XML responses contained a similar amount of information, and if we could pass some contextual information to the view (for example the type of thing we couldn't find). No problem, just define a map with our response objects and then define that same map as the view model, along with the status code and view:

<gist>spikeheap/9213738?file=4_the_full_sausage.groovy</gist>

Let's break the 404 response down a little.

1. <code>if(!widget)</code> is a Groovy way of checking for null/empty values
2. The model we're going to return has an obvious failure notification because we've set <code>success</code> to <code>false</code>, but we've added a little more information by saying the widget couldn't be found.
3. The first argument to <code>respond</code> is `model as Object`. This tells `respond` to use `model` for the JSON and XML responses. The coercion is required to prevent an error because of ambiguous arguments.
4. The second argument to <code>respond</code> is `[model: model, status: 404, view: 'error404']`, which provides the view arguments so the correct 404 GSP is loaded. The `model` specified here is the same as is used for the JSON/XML response, so the GSP has access to the same information to render to the user.

---

So there we have it: a simple way to `respond` and please all our sources. It's not quite elegant, and I'm going to see how easy it would be to roll this into the `respond` method itself. 

Is there a better way? Let me know in the comments!

