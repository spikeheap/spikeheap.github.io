---
title: Lessons learned from the NPD Find & Explore project
description: >-
  Earlier this year I had the pleasure of working with the Department for
  Education, Nimble and Paper.
date: '2019-06-13T17:31:00.823Z'
categories: []
keywords: []
slug: /@spikeheap/lessons-learned-from-the-npd-find-explore-project-6b044649b165
---

Earlier this year I had the pleasure of working with the Department for Education, Nimble and Paper on the Alpha and Beta phases of a Find & Explore tool for the National Pupil Database. Having reflected on that experience, here’s a few lessons I hope I can apply to future projects, in no particular order.

#### You can’t just waltz in at full speed

Complex organisations have complex processes. Take the time early on to map out these processes through the lenses of the different departments. As an example, in addition to the GDS process (Discovery → Alpha → Beta → Live) we had Architecture Review Board and Technical Design Authority gates for technical architecture, as well as the Agile Security Framework, and Data Protection Impact Assessment. These disparate processes were entirely necessary for each groups’ governance, and once we knew about them we were able to reuse documentation across each piece.

#### Don’t leave assumptions unchecked

I felt fairly relaxed when we found out we’d be given a subscription on Azure to deploy our environments using ARM templates, but this feeling was based on a bunch of assumptions. We were caught out a bit when restrictive policies and naming conventions were introduced later on. Talking more with the Ops/Infra teams would have eased this pain, and would have surfaced some key information about the platform and its state of development which only came to light later on.

#### Being an outsider can be a real boundary

We experienced a couple of instances where we had to work hard to gain trust and alleviate suspicion because we weren’t full-time employees within the organisation, and a couple of times it was assumed we didn’t understand the nuances because we weren’t really part of government. This skepticism can be really valuable to make sure the right decisions are being made, but it made it much harder to get buy-in for some of the changes we were proposing. Other members of the team were exceptional at prioritising building relationships to overcome this barrier, and in at least one case this paid off with a key ally pushing to overcome some internal bureaucratic hurdles so we could deliver quicker.

[Nev](https://twitter.com/nimphal) summed this up better than I could:

> The lesson from this is patience — if you are doing a good thing and believe in it, then persevere.

#### Interactive exercises are more valuable than just talking

The team brought some interesting exercises to meetings with users and other stakeholders, for example UI sketching to capture what the users thought a perfect workflow could look like. Even basic exercises like retros and lean agendas worked well to get people involved. It may be novelty, but its amazing what a pack of post-its and sharpies can achieve.

#### Relationships are the single most important factor of success

Our project would have faltered in the final weeks were it not for a couple of amazing colleagues in the enterprise architecture team pushing to broker a compromise between the security and cloud infrastructure teams which allowed us to meet our deadlines.

#### Trust your experience

This was my first time for a number of things:

*   Working on a government project
*   Being part of a GDS-style cross-functional team
*   Being Technical Architect on a project with a single developer
*   Working with agency contract Ruby developers

When it came to estimates, I second-guessed myself. Maybe I was being too pessimistic. Perhaps I’m just not a very efficient developer. Agencies are used to working with solo developers, and agencies seem to get a lot done. Maybe I should revise those estimates.

My “pessimistic” estimates were pretty accurate in the end, but I revised them. I should have trusted my experience and shunned the self-doubt. In future I’ll use that to start a conversation rather than talking myself out of it. I could still be wrong!

#### People play the long game

If the project is short and someone doesn’t agree with it, they can probably just wait it out, especially if the project team is external or will disband once it’s completed. This sounds cynical, but if they’ve seen lots of short-lived projects come and go they’re likely to experience change fatigue. They’ll also learn that they’ll outlive failing projects, and that it’s (maybe often) not worth the emotional or cognitive effort of engaging with something that seems flawed. This is a vicious circle, where a lack of engagement increases the chances of the project floundering, or just not meeting their needs, which then validates the initial resistance to engaging with it.

I’ve not got an answer about how to overcome this, other than that getting them onboard is almost certainly more important than it appears when you hit that first resistance.

#### The team is key

This isn’t new, but it’s good to reinforce that the team makes all the difference, especially when things get tough. During the last few weeks of the project we encountered a number of technical and process challenges which knocked us back and slightly off-course. This could have been a horrible environment, as the impending hard deadline ratcheted up pressure from ourselves to deliver what we’d set out to. I’ve been there before, and that stress leads to long hours, which leads to a whole host of other problems.

What actually happened was everyone came together to keep us afloat and (relatively) sane. Having a friendly, supportive environment in the office each day made the last weeks much more enjoyable, and helped prevent us spiralling off individually as we tackled our own challenges. Tacking on “check ins” (thanks for starting that Urska!) to see how everyone’s feeling, and openly promoting mental well-being and the importance of looking after yourself first is paramount. Kudos to Jon for always putting people first, and not faltering when times got tough.

When you’re part of a great team it’s easy to take it for granted. The lesson I’ve taken from this project is to be thankful, and to take the time to let people know when they’ve made an impact.