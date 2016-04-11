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

We can work around this behaviour of invalidating the cache on any change to the dependencies list by referring by seeding the image with a known static point in time. We'll start with an example and then pick it apart:

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

By grabbing our Gemfile from the `master` branch we get most of our dependencies up-front. The subsequent `bundle install` [2] then only needs to download dependencies that have been added as part of the feature branch. This means we can add and remove dependencies without fearing Docker invalidating the cache and downloading everything from scratch. 

Suddenly Docker on rubbish hotel wifi is fun again!

### Picking a seed point

## One-off cost of major gem installation, then incrementals
## When build slows down, update known-good point to speed it up again
## Example
### GitHub (with token)
#### GitLab side-note (with private token)

# This works for (almost) everything
## need to install dependencies to another path
## examples

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
