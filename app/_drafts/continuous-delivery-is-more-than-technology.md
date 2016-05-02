---
layout: post
tags: ['post', 'software', 'development', 'programming', 'continuous delivery']
title: "Continuous Delivery is more than a technical problem"
description: "Thoughts on the political side of implementing continuous delivery within a small business."
comments: true
---

There are [plenty](TODO) [of](TODO) [good](TODO) [articles](TODO) extolling the virtues of Continuous Delivery and showing how to leverage some exciting new technologies to get a code into production quicker.  There are also some [interesting](TODO) [opinions](TODO) around the costs of continuous delivery.  In this post I want to consider the cultural requirements and potential side-effects of continuous delivery on teams, particularly those working in small businesses.

<!-- more -->


## Ranty ramblings

#### The risk: all rush, all the time

Continous delivery is often sought after because it decreases the time between a feature being 'done' and it being available on production.  This is a worthwhile goal, shortening the feedback cycle, reducing the pain felt by long-running branches, and getting rid of the pre-deploy worry when you have a few hundred commits going out in a single release.  But there's a sinister side to this increased cadence.  The increase in perceived pace has a a knock on effect on both the stakeholders and development team.

For the stakeholders the faster turnaround and ship-when-it's-done approach can easily lead to increased pressure on the development team to deliver quickly. If this continues for a prolonged period you can easily end up with a burned-out team.

This point may seem obvious, but it's surprisingly hard to avoid. The increased visibility of completion leads naturally to a focus on it.

TODO think about this more and finish off.

### The big shift. When is done, done?

TODO - shipped to production before the feature is complete or (potentially) signed off.



# TODO - shift to approval in production


# Monday's rambling

Moving to CD

I'll start by saying this is caveat central. There are a plethora of good posts about how continuous delivery can work, and the technical tools available. It's easy to omit the human side of shifting to continuous delivery. 

First, let me describe a typical development pre-CD workflow, which I've seen in various guises. A developer will pick up a feature from the available items, and works on it until they believe it is done. A stakeholder outside of the development team then evaluates that issue against their needs, and feeds back changes that need to be made. Some of these changes are omissions from the orignal spec, and some are new requirements that have only become obvious upon presentation of the 'finished' feature. There is then a period of back-and-forth between the two parties until the feature is accepted, when it's merged into the main branch and deployed to production.
