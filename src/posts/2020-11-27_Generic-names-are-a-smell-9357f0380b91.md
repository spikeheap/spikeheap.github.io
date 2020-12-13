---
title: Generic names are a smell
description: >-
  Names are powerful. Good names are intuitive, and communicate intent and
  meaning to the reader. Good names help us have discussions…
date: '2020-11-27T09:49:34.176Z'
categories: []
keywords: []
slug: /@spikeheap/generic-names-are-a-smell-9357f0380b91
---

Names are powerful. Good names are intuitive, and communicate intent and meaning to the reader. Good names help us have discussions without ambiguity, and gently nudge us towards a shared understanding of the thing.

Bad names, on the other hand, slyly make our lives harder. They hide ambiguity, and introduce tension into discussions. They make agreement harder, with different parties taking the name to mean different things. Sometimes none of these match the original intent, or even what the thing does.

The worst of it is that bad names are crafty. They sneak into conversations, documentation and code. Often, they _look_ like good names, until it’s too late.

One reason for this is that software development exists in an abstract world, where we strive for generality. We hope that by solving the general case we can promote reuse, or maximise the use-cases our system satisfies.

These intentions are noble, but I think this leads us to prematurely over-generalise. When we do it too soon, it’s all too easy to make poor design decisions because the ambiguity is hidden behind names which mean little to us.

#### Whose backend are we talking about?

This is most obvious when we’re talking about architectural components. I want to single out “Backend” and “Frontend” as pervasive examples of overly generic names. If you see these in the wild, beware! If they come up in conversation, there’s a high likelihood that what people think these terms mean will differ within the group.

As an example, a recent Hacker News [article](https://kartick.substack.com/p/make-your-backend-layer-as-thin-as) talked about making “your backend as thin as possible”. The article has a number of other problems, but biggest of all is that “frontend” is completely meaningless. In one organisation it might mean a single-page JavaScript application, in another it’s a Node process serving a website. “Backend” doesn’t help much either. Maybe it means a single Django app on a server that does all of your organisation’s business logic. Maybe it’s a backend-for-a-frontend (that’s a bit meta), with a load of micro-services in the background.

I know what you’re thinking: “frontend” isn’t ambiguous, and it doesn’t mean what you just wrote. But this is a real example. I know real live people, good engineers, who refer to a Node app as a “frontend” and at the same time have React components in the browser making API calls to that app. This might sound crazy, but it’s a simple and straightforward evolution, where the names “backend” and “frontend” were used on day one, and stuck.

#### Great, but what does “better” look like?

Figuring out what’s better is hard. Naming is one of the hardest problems in software engineering. Rather than offering a prescription for naming that can’t fit everyone’s needs, instead there’s two questions I ask when I see any name:

1.  Does this name help me understand what problem it solves, and how it works?
2.  Do these names mean something else (more generic, specific, or just different) in another context?

With these two tests, we can validate potential names. Sometimes all our options will fail one or both of these tests, so we’ve got the option to pick the least-bad one, or rethink the problem entirely. If we can’t find names that pass these tests I treat that as a smell. Are we trying to wedge something into an abstraction that doesn’t fit? As with all smells, it’s not definitive proof that you’re doing something wrong. It’s just a hint, a thread to pull.

#### A practical example

Let’s assume we have a headless content management system (CMS), with a lightweight application which uses the CMS content (among other things) to serve HTML, CSS, etc. to the browser. We _could_ call the lightweight application the “frontend”, and the CMS the “backend”, but this doesn’t convey any meaning to a new engineer. These names fail the first test. At first glance it _looks_ like the names convey some standard meaning, but as we’ve already covered, they don’t even tell us how it works or where it might live in our stack — a backend could be an API or a something serving HTML. So, these names fail the second test as well.

To name these better, we need more information. Let’s say the CMS serves a wide range of content for people in a care home. We know that the CMS is the only source of internally curated content, but we’ll aggregate content from third parties later on. The lightweight application serving content to the browser is only for residents, but has additional features such as chat.

A few options come to mind for the CMS component (there are myriad more, and that bike shed is left as an exercise for the reader):

1.  “CMS”. Pretty basic, but short is good, right? This passes the first test of helping me understand what the service does, but doesn’t help me understand how it works.
2.  “Headless CMS”. Okay, now we have a bit of information about how I might interact with it, and what it does. This _looks_ like it passes the first test, but our noses tell us to hang on — it helps us understand the technology, but not the problem it’s solving for our users. It also fails the second test of being too generic. Our CMS solves a specific problem, so we can use the name to reflect that.
3.  “Residents local content API”, flips things around a bit. This looks like it passes the first test. I can tell from the name what I’d expect the CMS to contain, and how I’d interact with it. It’s also clear it has something to do with residents, though it’s not obvious whether it’s authored by them, served to them, or both. It also passes the second test — the name _feels_ about the right level of specificity. Another CMS could be added without confusion, and we could introduce an external content API without needing to rename anything.
4.  “Residents local video series API” makes our name even more specific, but maybe we’ve gone too far. Are we confident that we’ll only ever add series of videos? Does the one audiobook on the CMS invalidate that name?

Even in this simple example, a whole bunch of questions come up. You know you’re on the right path when those questions are specific to your teams, organisation, and users.

#### Summing up

Next time you’re naming a service, application, or component in your code, validate them against these two tests.

1.  Does this name help me understand what problem it solves, and how it works?
2.  Do these names mean something else (more generic, specific, or just different) in another context?

If they pass first time then great! You’ve increased your confidence.

If you’ve tried this approach, or tackle this another way, I’d love to hear about it in the comments or \[on Twitter\]([https://twitter.com/spikeheap](https://twitter.com/spikeheap)).

---
This post was originally published [on Medium](https://spikeheap.medium.com/generic-names-are-a-smell-9357f0380b91).
