---
title: Invest in internal tooling
description: Empower colleagues to solve their problems early to retain your development velocity
date: '2018-07-31T10:42:15.937Z'
categories: []
keywords: []
slug: /@spikeheap/invest-in-internal-tooling-8bf038e45e07
---

> Hi Ryan, could you do me a favour and just confirm this user’s account please?

This request didn’t pop up in Slack in the first days of a new user confirmation feature. I was seeing this a couple of years later. The single line of Ruby was well known amongst the developers (it’s hardly rocket surgery) as we’d get a couple of requests a month, and within minutes we’d marked that account as confirmed and got back to more interesting challenges.

I see it over and over again. I fall for the same thing myself, even though I should know better: failing to automate menial tasks that encumber our non-developer colleagues because there’s “more important stuff to do”.

In our case, we’d gone as far as to create an issue to track adding a user confirmation function to the admin dashboard. It was hard to prioritise it above revenue-generating stories and it languished. A couple of years (!) later we sat down with the support team and figured out this was one of two things they regularly came up against which required the dev team. This was understandably frustrating for them — support resolution times were a key metric of their performance so having to fire off a message to a group of developers who would much rather stay focussed on their current work ground them down.

It took a couple of hours to change this from something only a developer could do to a task that can be resolved by any member of the team. Not only did this empower the support team, it also reduced the amount of urgent interruptions the dev team was getting.

#### Value non-developers

Developer time often takes precedence because it’s so easily tied to the delivery of new features. When there’s a push for features and pressure from investors it’s easy to sideline other functions of the business. Sales and Support often benefit from being able to get insights into the system, flip check-boxes, and set up new accounts. Spending time to make their lives easier reaps dividends (if you’ll excuse the pun) not just in their productivity but also in engagement with the developers. Small businesses really need to fight to keep everyone on the same side, and it’s easy for boundaries to emerge when people feel hard-done-by.

#### What do you tackle?

Good candidates for enhancement fall into two categories:

1.  Simple administrative tasks, for example adding users to a client organisation.
2.  Reporting and business intelligence.

It may be that the development team can come up with a list of internal requests they see often, but in the spirit of engaging the whole business a great place to start is to interview representatives from each business function with a question:

> If we could do one thing that would make your work easier, what would it be?

And if you like variety, a more open question which allows you to work through to the solution is:

> What hiccups are there in your workflow? Where are you left needing answers from developers, or just guessing?

The development team can weigh in on the complexity of the fixes. Value isn’t just measured in time, but there’s a handy graph to give you an idea of how to evaluate time-saved vs development effort by XKCD:

![XKCD comic: how long can you work on making a routine task more efficient?](/images/2018-07-31_Invest-in-internal-tooling_xkcd.png)

#### Quick fix ideas

One of the most common quick-fixes is to add an admin dashboard, such as [RailsAdmin](https://github.com/sferik/rails_admin). With very little custom code, your non-technical internal users can add, edit, and maybe delete records from your application. This (obviously) requires a degree of caution, but resolves a host of tiny support requests.

It’s also very common to see the business requesting simple reports from the developers, e.g. the number of registrations by month for the past quarter. Maybe these rear their heads for investor meetings or quarterly all-hands, but they always point to a more subtle problem — the business lacks Business Intelligence tools. Spending half a day installing [Metabase](https://www.metabase.com) may not only prevent these requests coming through, but also empower other parts of the business to investigate your data and start making more informed decisions. One of our clients still raves about the impact Metabase had on the whole business over a year and a half later!

#### So, when do you enhance?

“Soon, when we have a bit more time” is a popular response. The future always feels like it’ll be a little less busy, a little more structured. The truth is that future never comes; once the imminent hurdle is overcome the next challenge comes into view.

The time to do it is now. Always. Making tiny improvements to the working lives of your non-developer colleagues pays back many times over, compounding productivity on both sides as developers are interrupted less often (or at least, for less meanial sidetracks 😛).

The most common approach to setting aside time seems to be adding one or two items into a sprint as nice-to-haves, but this feels like it subverts the principle of the sprint because they’re often seen as lower priority (and we all know everything in the sprint scope is equal… sometimes).

Another way which looks very promising is to have one week of improvements every 4–6 sprints. I read an article a while ago which described lining up sprint starts with the beginning of a month, which built in both the internal improvements iteration week _and_ made it easier to other parts of the business to know when sprints would start/finish (if anyone can remember where that was from I’d appreciate the link!).

There’s always the good, old 20% time approach. We’ve successfully run “Fun Friday Afternoons” where we were a bit tight and only had 10% time. The point is to experiment and see what works well for _your_ team.

---
This post was originally published [on Medium](https://medium.com/honest-focus/invest-in-internal-tooling-8bf038e45e07).
