---
layout: post
tags: ['post', 'software', 'development', 'programming', 'hackday', 'event', 'coderetreat', 'TDD', 'testing']
title: "Oxford's Summer of Hacks 2014 – Code Retreat"
date: 2014-08-06 15:58:00+00:00
comments: true
published: true
---

On Sunday the 6th of July we ran the second Oxford Code Retreat, so here's a few notes I've made about the event. <!--I also made some notes on hosting Code Retreats [here](/posts/2014-08-06-hosting-code-retreat)
-->

<!-- more -->

## The JSOxford Summer of Hacks Code Retreat

Okay, so it's not a super-snappy title, but the [Summer of Hacks](http://jsoxford.com/2014/summer-of-hacks/) has been a great success so far. The Code Retreat was the second event in the series, and this time we did it for Ruby, Python and JavaScript.

Removing the language restriction was quite nice, and although we initially had a 90/10 split of JavaScript/Python for the first session that evened out to 50/50 after lunch. No dedicated Rubyists turned up, but Pete still managed to test out his Ruby test runner.

The nice thing about the Code Retreat format is that it plays well to most languages, so running Python and JavaScript alongside each other didn't require any special tooling. I'm a huge fan of polyglot events (being a multi-linguist myself), and it was great to see a mix of people rather than the JavaScripters at one end and Pythonistas at the other.

The turnout for this event was completely different to the last one, and it was great to see the majority who turned up were testing/pair-programming newbies. We had intended to make TDD/pair-programming secondary, but through each session we had a reasonably constant flow of TDD-related questions so that obviously didn't happen!

One of the things I love about events like this is how it makes me question the things I've come to take for granted. A couple of times I was faced with questions about TDD taking too long or appearing to be a big time drain, and whereas online you might just dismiss questions like that with "they just don't get it", it has really helped me clarify my reason for loving TDD and think about the inherent tradeoffs and assumptions.

So because I made everyone suffer my retrospectives on Sunday, here's my quick retro:

### What went well?

##### TDD & pair programming

All my planning had been around the idea that we'd done TDD/pair-programming as a focus in the first Code Retreat, so it was old-hat and would be boring to push it a second time. Wrong! There were quite a few attendees who hadn't really used TDD in anger or who were just experiencing pair-programming for the first time, so I had quite a few discussions about how it worked 'in real life' and whether it was just a construct which is nice for events but isn't really practical. 

This accurately reflects the experiences I've had recruiting for developers at all levels, and I'm much less surprised when I hear people describe testing as a secondary activity or something that would be nice if there was more time. In fairness most developers seem to agree that tests are necessary, and there is still a big debate about what constitutes the right amount of testing, and if it should be part of the design/development process. Either way it was good to be part of the discussion!

##### Defensive programming

Our second session was to have a development battle. When writing tests it followed the standard TDD mantra of write as little as possible to get the test to fail, but when implementing the function the approach had to be to do it in the most obscure or wrong way possible, whilst still making the test pass. 

The resultant code was (obviously) atrocious and tended towards micro-methods, but it was interesting to see how everyone perceived it: was it a poor activity or a chance to think about one of the purposes of writing tests in a collaborative environment? Some of the code I saw closely resembled production code I've seen from projects that I won't name here which had been running for much longer than 20 minutes, but no-one sets out to produce code that poor, right?

##### Discussions & the people

Of course, I have to say this, but it was genuinely good fun running the event, and it never felt like hard work getting contributions during the post-session chats. There was almost always something interesting being worked through, sometimes heatedly! I am a strong believer that the point of these events is mostly to get interesting people into the same room so we can all learn things from each other. Events really are only as good as the people who turn up, so thanks to everyone who made it.


### What could have gone better

##### Focus on the meaning
When we set the kata and planned the sessions the focus was on what we were trying to get the attendees to think about, working backwards to find constraints which would exercise that. It all (sort of) went to plan, but during the event I completely forgot to focus on that same end goal! As a result I think a few people were left wondering why (for example) there wasn't a planning session before the round-table programming session. 

##### The venue
The [Jam Factory](http://www.thejamfactoryoxford.com/) is a great pub with a friendly feel and lots of light, and it would be great for an evening party or talk. In the height of summer the Boiler Room really is that, a glass-roofed hotbox. All that light streaming in also meant our projectors were useless. Fortunately we had a backup 40" TV, but that was really a little too small while still taking up a load of space.

Being an (almost) free event meant we had to fund the venue and catering through sponsorship. Our sponsors [Haybrook IT Recruitment](http://www.haybrook.co.uk/) and [GitHub](https://github.com/) were amazing, but we struggled to make their contributions, along with the £5 entry fee, cover all the things. Lesson learned: figure out the constraints of the venue in advance (like not being able to bring our own refreshments & snacks) and either work with them to compromise, ask for more sponsorship or change the venue.

We were keen to host things at the Jam Factory so it didn't feel like work, and was more friendly and informal than the standard conference-style event, and I think it almost achieved that. 

##### The testing wrappers

We had a grand vision for getting real-time results from the pairs to build a live, developing game of life on the projector, as well as collecting stats for pretty graphs. We also wanted to have test wrappers for each language which would get as close to zero-setup as possible for attendees. There was a great push by George and Pete to knock out Python, Ruby and JavaScript test runners, and we had limited success in actually running the tests. Unfortunately the test runners weren't as stable as we would have liked so they were quickly relegated for some.

Since the event Uxebu have open-sourced [TDDBin](https://github.com/uxebu/tddbin-frontend), which we've used with great success for previous events. It's great to see them open up the code, and we'll certainly build on that for future events.

### Summary
Each time I've run a Code Retreat there are things I'd do completely differently next time, and to be honest it would be boring if that weren't the case. As always it was an interesting event, and hopefully the attendees got as much out of it as I did. 

A few people have written up the day. If you've done the same let me know and I'll add you to the list below:

* [Tom Lane](http://tomlane.me/2014/07/jsoxford-code-retreat/)
* [Dan Pope](http://danielthepope.wordpress.com/2014/07/09/tdd-is-still-alive-jsoxford-code-retreat/)
* [Marcus Noble](https://blog.marcusnoble.co.uk/12-07-2014-jsoxford-code-retreat)



