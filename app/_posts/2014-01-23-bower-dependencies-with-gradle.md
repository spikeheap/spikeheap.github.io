---
layout: post
tags: ['post','gradle', 'open source', 'nodejs','npm','bower','build']
title: "Bower dependencies with Gradle"
date: 2014-01-23 10:48:40 +0000
comments: true
published: true
---

We all know [it's important to be able to build your code in one step](http://www.joelonsoftware.com/articles/fog0000000043.html), but when I came to build a project I'm working on at home I found it was actually a bit of a faff. Gradle came to the rescue, and in 15 minutes we made steps towards having a 1-step setup and build.

<!-- more -->
The project in question is built in Grails but uses Bower to ensure we have the right versions of AngularJS, Bootstrap, etc. Once your development machine is setup it's as "easy" as running <code>bower install</code> whenever the dependencies change, and otherwise using the standard <code>grails</code> commands. 

When you come to a fresh machine there are a few more steps before you can get up and running:

1. Have I got Grails installed?
2. Have I got NodeJS installed?
3. Have I installed Bower using NPM?
4. Have I run Bower to install the dependencies?

This is already too much hassle! Grails makes life easier by generating a [Grails wrapper](http://mrhaki.blogspot.co.uk/2013/03/grails-goodness-using-wrapper-for.html), <code>grailsw</code>, so we don't need to check that Grails is installed. So far, so good!

NodeJS is a requirement for development, so I made the assumption that any developer machine would have it present. From there I wanted to use NPM to install Bower and then run Bower to grab the dependencies. There were plenty of options but I'm keen to learn a bit more Gradle so this was a great opportunity. 15 minutes later and we've got a build file (thanks to [Mr Haki](http://mrhaki.blogspot.co.uk/2010/10/gradle-goodness-parse-output-from-exec.html) for the OutputStream processing):

{% gist spikeheap/8558786 %}

There may well be a better way of doing this, but it worked for me on OSX. There was a path-related error when we tried to run it on Windows, and if anyone can point out why that would be great.

Once the Gradle build has completed you still need to run <code>grailsw run-app</code> but 2 steps is better than 4. A brief foray into [building Grails with Gradle](https://github.com/grails/grails-gradle-plugin) yielded spurious errors before my 15 minutes was up, but recent commits may well solve that. Grails is expected to move to Gradle for version 3, so soon we'll be able to do our entire build process through a single click. 