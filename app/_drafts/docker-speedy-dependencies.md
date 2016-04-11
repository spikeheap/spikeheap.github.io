---
layout: post
tags: ['post', 'software', 'development', 'programming', 'docker', 'npm', 'bundler', 'rails']
title: "Speedier dependencies with Docker"
comments: true
---
Docker is great for building portable applications, modelling complex environments locally, and helping us bridge the gap between development and production, but installing your Bundler, Bower, NPM, Maven (and so on) dependencies can make builds slow. This post explains how to speed up your builds by seeding the image with most of your dependencies, so subsequent builds aren't hampered by the 'all-or-nothing' approach to updating dependencies.

<!-- more -->

# What we have already / what's the problem?
## Thoughtbot post
### Good start but slow when gemfile changes
## Follow-on post with volumes, speeds up incremental changes
### Immutable build artefacts

# Immutable build artefacts?
## Runnable containers without dependencies
## Github/rubygems offline
## Promotable builds

# A new solution: bundle known point in past before thoughtbot approach

We can work around this behaviour of invalidating the cache on any change to the dependencies list by referring by seeding the image with a known static point in time. 

We'll start with an example and then pick it apart:

```dockerfile
ENV APP=/usr/src/app
RUN mkdir $APP
WORKDIR $APP

# [1]
ADD https://raw.githubusercontent.com/user/repository/master/Gemfile .
ADD https://raw.githubusercontent.com/user/repository/master/Gemfile.lock .
RUN bundle install

# [2]
ADD Gemfile .
ADD Gemfile.lock .
RUN bundle install

# [3]
ADD . $APP
```

What we're doing here is fairly straightforward:

1. Install your dependencies from a source which changes infrequently. Here we've used the master branch of our repository, but you could use a tag or static commit and update it when your builds slow down too much.
2. Install any dependencies we didn't get in [1]. This will just be new dependencies added in your current branch.
3. Add our source code (and do the rest of the build).

By grabbing our Gemfile from the `master` branch we get most of our dependencies up-front. The subsequent `bundle install` [2] then only needs to download dependencies that have been added as part of the feature branch. This means we can add and remove dependencies without fearing Docker invalidating the cache and downloading everything from scratch. Note that [2] and [3] are the popular approach to caching you're probably already using, so all you need to do is add [1].

Suddenly Docker on rubbish hotel wifi is fun again!

### An aside: this isn't all about Ruby!

This approach isn't Ruby specific, so you can speed up your NPM dependencies too:

```dockerfile
ADD https://raw.githubusercontent.com/user/repository/master/package.json .
RUN npm install

ADD package.json .
RUN npm install
```

Or your bower dependencies:

```dockerfile
ADD https://raw.githubusercontent.com/user/repository/master/bower.json .
RUN bower install

ADD bower.json .
RUN bower install
```

You get the idea!

### Picking a seed point

The point you cache in step [1] can make all the difference to your build times, particularly if your dependencies change regularly. We've chosen to minimise manual intervention by using the `master` branch, ensuring the cache point will follow our deployed code closely. It's also completely reasonable to use `develop` if you have a slower release cadence.

### Getting the historical dependency list

In the above examples we've just referenced a public GitHub repository, but chances are you're working with private repositories or outside of GitHub. Fear not, we've got you covered.

#### Private GitHub repostories

If you're using GitHub private repositories you're in luck: they generate per-file keys to allow you to access a file using a simple URL, e.g.:

https://raw.githubusercontent.com/spikeheap/spikeheap.github.io/develop/Readme.md?token=AAcTYrCCgOS9dBSyTPBWlx_6a0hs9Q2qks5XFJOwwA%3D%3D

You can get the token for your files by viewing the file on GitHub and clicking 'Raw' before copying the URL from your address bar. 

#### BitBucket, GitLab (and most other) repositories

#### Fallback

If you're using something completely esoteric, you can use Docker's `RUN` command in preference to `ADD`ing them as we have above. Through `RUN` you can curl your files down, install a custom client, or whatever you need.


# Other options
## Check in a second set of Gemfile / Gemfile.lock files
## Generate the files from a local git repo. Is this even possible?

# Other bits
<!-- 
Using the above approach we get the benefits of cached dependencies with the benefits of quick builds and deployable artefacts.

Deployments are hard. Striking a balance between stable production builds, fast development cycles and keeping development and production as close as possible is even harder.

### The paradox

Docker images should contain all of the dependencies required to run your application. If we can guarantee that all our Bundler, NPM and Bower dependencies are already built into the image, we no longer need to worry about outages of `rubygems.org` or `github.com`.
-->
