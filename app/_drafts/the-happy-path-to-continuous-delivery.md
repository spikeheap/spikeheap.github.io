---
layout: post
tags: ['post', 'software', 'development', 'programming', 'continuous delivery']
title: "The happy path to Continuous Delivery"
description: "There's more to Continuous Delivery than just blue-green deploys."
comments: true
---


TL;DR it doesn't exist. For most teams the move to CD requires a buy-in from technical and non-technical stateholders, and (generally) a significant amount of up-front work on infrastructure, the existing codebase, and company culture.

<!-- more -->

Okay, so maybe my lead-in makes it sound quite bleak. Let me backtrack a litte. Continuous Delivery! It's great! Whoop! Right, are we excited again?

Continuous Delivery is a significant departure from the working practices of many software teams.


### Prerequisite #1: team fit

### Prerequisite #2: management buy-in

### Making the shift

<blockquote>
<p>Don't dive straight in. Test the water and check for rocks just beneath the surface.</p>
</blockquote>

### Step #0: addition-only, short-running migrations



### Step #1: hotfix often

You can get a feel for how continuous delivery might feel by taking a selection of features and developing them using your hotfix workflow. If you're coming from a git-flow system, this means merging straight to your main branch, and deploying as soon as the feature is merged. You'll be able to see where the bottlenecks are, and which bits of the deployment are painful and slow. More importantly, you'll get to see the political ramifications of such a change. Is the product/QA team able to review the new feature? When do other stakeholders expect to see changes go live, and how are they notified of changes?

### Step #2 feature toggles

Feature toggling allows you to ship code to production which isn't yet active. This means code can be made live without requiring non-technical review, and breaks the connection between activation and delivery by the developers. This is the single biggest technical change you can make to empower developers as it empowers them to release and deploy asynchronously to business deadlines. With that empowerment comes responsibility: features shipped to production must be stable, because the developer might not be around when it's switched on. 

##### How much is too much?

Feature toggling is easy to get wrong. A poorly implented toggle will result in your codebase being littered with `if`/`else` statements and deprecated code which everyone's too scared to touch for fear of breaking things. Consider features and changes you've built recently, and come up with the common points on your architecture where toggling could be applied. Often, a simple abstraction or set of guidelines can save a lot of leg-work later on.

### Step #3 test the deployment

The odds are good that you're manually verifying your deploy. If you're really cocky, maybe a Capistrano success message is enough. Maybe you just check the homepage, or maybe you dig into the site to check core functionality is working. Maybe you go even further and check that it works in a couple of different browsers. There's also a good chance that someone outside the development team is doing this as well. 

Continuous Delivery also means lots of deployments, which makes this approach untenable. Start building a small suite of end-to-end tests which can be run against production to test some of the key integrations and critical pathways. We'll call them 'smoke tests', and their aim is to verify that the deployment has worked. A couple of key differences from standard end-to-end tests:

1. They can run against any system, so shouldn't presume the presence or absence of any data.
2. They will be run against production, so the integrity of existing data and aggregate statistics is vital.

Smoke tests work in addition to your end-to-end tests (let's call them 'functional tests' here). The functional tests check that a feature works through a browser, possibly against different browser versions. Smoke tests should assume that the features have been tested, and instead are testing things that can vary between environments, for example checking that communication with an external API is possible, or that a registration which requires a 3rd party CAPTCHA can be completed.

If you don't have a suite of functional tests, you'll want to build them for the business-critical features (and at least for the [happy path](TODO happy path testing)) now. The first tests you add will likely be tests that someone in the business does manually on some (if not all) deploys.


# TODO developer autonomy for smaller things

### Step #3 think

So you're deploying the majority of your code changes as hotfixes, and hiding many changes behind feature toggles. Undoubtedly you're starting to feel some pain. Maybe the deployment takes a while, or you're forced to do some manual interventions at the end. Now is a good time to take stock. Feel the pain and try to understand the causes for each point. Some you'll be able to fix easily, others will require infrastructure changes or alterations to the way you work. 

### Going for gold: the blue-green deploy
