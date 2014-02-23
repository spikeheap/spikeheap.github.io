---
layout: post
tags: ['post','geb', 'grails', 'groovy','testing']
title: "Testing double-click events using Geb"
date: 2014-02-06 22:48:40 +0000
comments: true
published: true
---
Testing basic interaction with Geb is easy, but the 'intuitive' way of doing double-clicks fails silently and without any real indication as to why. Fortunately there's a simple solution!
<!-- more -->

My first approach was to use <code>dblClick()</code> in place of <code>click()</code>. The result was a test which compiled and ran, but failed to generate the double click event:
<gist>spikeheap/8845429?file=failingSpec.groovy</gist>

It turns out that double-clicking is a "complex interaction", and because it isn't used that much on webpages it's not part of the core functionality of NonEmptyNavigator.

Fortunately building complex interactions is trivial in Geb, so my updated Spock test only needs one line replacing:

<gist>spikeheap/8845429?file=passingSpec.groovy</gist>

Great, on to the next test!

### Update (7/2/2014)

Here's another example, this time using interactions to do a context-click (right-click to you an me!):

<gist>spikeheap/8862048?file=contextClickerSpec.groovy</gist>

If you want to run the test, the following gradle script will sort you out:
<gist>spikeheap/8862048?file=build.gradle</gist>