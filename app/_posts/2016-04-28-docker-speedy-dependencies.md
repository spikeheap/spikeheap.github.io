---
layout: post
tags: ['post', 'software', 'development', 'programming', 'docker', 'npm', 'bundler', 'rails']
title: "Faster dependencies with Docker"
description: "This post explains how to speed up your builds by seeding your Docker image with most of your dependencies, without resorting to data volumes."
comments: true
---
Docker is great for building portable applications, modelling complex environments locally, and helping us bridge the gap between development and production, but installing your Bundler, Bower, NPM, Maven (and so on) dependencies can make builds slow. This post explains how to speed up your builds by seeding the image with most of your dependencies, so subsequent builds aren't hampered by the 'all-or-nothing' approach to updating dependencies.

<!-- more -->

### A quick note on terms

This post talks about a `Gemfile` and Ruby's gems, but this post applies equally to libraries and dependencies in pretty much any other language. If you're not familiar, the `Gemfile` is the list of libraries, frameworks, and other 3rd party dependencies.

### Rebuilding gems/NPM from scratch is slow

Docker images should contain all of the dependencies required to run your application. If we can guarantee that all our Bundler, NPM and Bower dependencies are already built into the image, we no longer need to worry about outages of `rubygems.org` or `github.com`. No contention there, right? However, building your dependencies into the Docker image comes at a cost: every time your dependency installation step happens there's a good chance you're blowing away every dependency you downloaded in the last build. 

The [Thoughtbot Rails on Docker post](https://robots.thoughtbot.com/rails-on-docker) demonstrates how to only bundle your gems when your `Gemfile` changes, which at least means your dependencies aren't re-downloaded every time the code changes. If your dependencies change regularly you're still a bit stuck. Every time you add, remove or update a gem, the cache is invalidated and the `bundle install` step runs again, downloading every gem from scratch.

[Brad Gessler built on that approach](http://bradgessler.com/articles/docker-bundler/) to leverage data volumes as a cross-container gem store. By updating the dependencies in a container you no longer need to re-build your image each time, which speeds up your development cycle immensely. This comes at a cost: by using volumes we're maintaining state for the container which may not be obvious later on. This _may_ be fine, after all we don't rebuild the image every time we change the code. However if we're pushing towards immutable infrastructure it's reasonable to treat your gems in the same way as your OS and system dependencies. This approach also allows our environments to diverge, so a piece of code can't be expected to behave the same way for the same container if we run it on different machines with different sets of gems installed. 

The intention is solid, so how can we apply the same principles to the image build process instead?

## A new solution: cache dependencies from a point in the past

We can work around Docker's behaviour of invalidating the cache on any change to the dependencies list by seeding our image with dependencies from a static point in time. Once we have the majority of our dependencies cached, subsequent `bundle install`s will only need to grab the newer gems.

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

1. Install your dependencies from a source which changes infrequently. Here we've used the master branch of our repository, but you could use a tag or static commit and update it when your build takes too long.
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

In the above examples, we have just referenced a public GitHub repository, but chances are you're working with private repositories or outside of GitHub. Fear not, we've got you covered.

#### Private GitHub repostories

<b>Update (2016-07-27):</b> <em>It turns out that the tokens described below expire after an arbitrary amount of time, so this approach will break regularly. Stay tuned for a stable approach, using the GitHub API.</em>

<del>If you're using GitHub private repositories you're in luck: they generate per-file keys to allow you to access a file using a simple URL, e.g.:</del>

```
https://raw.githubusercontent.com/spikeheap/spikeheap.github.io/13b4a64d90fece1889c6c24e8f736a2241fefc6c/README.md?token=AAcWYgmWJyDeDs_6aO-UemuC7ywONtd2ks5XKakOwA%3D%3D
```

<del>You can get the token for your files by viewing the file on GitHub and clicking 'Raw' before copying the URL from your address bar. </del>

<del>Note that the tokens are __per commit reference__, so you should use commit-specific URLs in preference to branch references. The following link will break and return `404` as soon as `develop` is updated:</del>


```
https://raw.githubusercontent.com/spikeheap/spikeheap.github.io/develop/README.md?token=AAcWYgmWJyDeDs_6aO-UemuC7ywONtd2ks5XKakOwA%3D%3D
```


#### Private repositories on BitBucket, GitLab, etc.

Most other services provide token-based access to raw files, and an exercise for the reader to work out their intricacies. [This StackOverflow answer](http://stackoverflow.com/a/34499948/384693) demonstrates it working for BitBucket.

Be sure to consider where your keys/tokens may be exposed. The GitHub example uses tokens specific to each file/revision pair, so the cost of an exposed key is quite small. If you're exposing your private API key which gives write-access to your repository, things are a little different 😱😨😰.

#### Fallback

If you're using something completely esoteric, you can use Docker's `RUN` command in preference to `ADD`ing them as we have above. Through `RUN` you can curl your files down, install a custom client, or whatever you need.

## Summary / TL;DR

Using the above approach we get the benefits of cached dependencies with the benefits of quick builds and deployable artefacts.

Deployments are hard. Striking a balance between stable production builds, fast development cycles and keeping development and production as close as possible is even harder.

1. Speed up your Docker image build time by using a version of your dependencies list which changes less frequently to leverage Dockers caching mechanism.
2. One good source for the more-stable dependencies list is your GitHub repository.
3. Be careful not to expose your keys and secrets.
4. Only do this if image build time is impacting some part of your life!


