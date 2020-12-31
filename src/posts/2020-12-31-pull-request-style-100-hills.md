---
title: "Pull-Request style: 100 hills to die on"
description: >-
  Back in the early days, once we’d whittled our keyboards from blocks of granite, we’d debate tabs vs spaces. Now it's pull requests...
date: '2020-12-31T16:05:00.000Z'
categories: []
keywords: []
slug: pull-request-style-100-hills-to-die-on-703475d36d74
---

Back in the early days, once we’d whittled our keyboards from blocks of granite, we’d debate tabs vs spaces. Then we moved onto fixed display widths. Many a good friendship was lost to these worthy causes.

Then one day, something happened to restore peace. Swanky editors with soft-wrap, style guides, and EditorConfig united developers around one principle: consistency. Consistency was hard to argue against, and as tooling made it easier to promote/enforce we started to realise that the actual choice didn’t matter that much really.

So our armies retreated to our caves, ushering in an age of peace and productivity. But with that peace came complacency, and murmurings started again, this time around code collaboration. The Git Flow Wars of the 2010s saw the resurgence of trunk-based development and a return of the endless debate, this time around whether `git rebase` was a silver bullet or a corrupting force of evil.

Now we’re well into the age of the Pull Request, and the questions are coming back. Who should merge them? How big should they be? What should they contain? How should we review them? Disciples of the many “One True Way”s are out in force, but we already know the answer: it probably doesn’t matter what you pick as long as you’re consistent. Consistency within a team or organisation is what we’re after, not consistency across a career.

As a technical lead, delivery manager, or just someone hoping for a quiet life, here’s a checklist of the subjective debates that risk bikeshedding and becoming a time-sink. When they crop up in reviews it’s a “smell”, a signal that the team has a diverging understanding of concepts that we need to be able to rally around. It’s tempting to set up a session to talk about how you *should* be doing things, but that’s a red herring. The first thing you need to do is get agreement on how you *are* doing things, and write that down. We can call it a Team Charter, a Ways of Working document, or anything meaningful to your team. The important thing is to document the decision. For an extra point capture a simple “why”.

Once we’ve captured our baseline, we can apply some agile goodness and iteratively improve the way we work. Retrospectives are a great place to reflect on how your ways of working help or hinder you, agree experiments to try, and evaluate their effectiveness.

### The list

There’s nuance to many things on this list, and there may be objectively “better” options, but often they’re marginal gains rather than the only way to avoid catastrophe.

The list is grouped into three areas: commit etiquette, pull request scope, and how we merge.

Commit etiquette:

* Step-by-step commits.

* Merge `main` into the branch or rebase?

* The perfect commit history.

* All commits pass CI (e.g. enforced git precommit hooks)

* Commit messages. Is there a format? Do we use semantic commit messages? Should every message contain [Gitmoji](https://gitmoji.dev)?

* Should lint fixes be a separate commit?

Pull request scope:

* “Scouting” and refactoring as a separate commit or different PR?

* Coverage & quality creep. Is it okay for a single PR to leave the codebase slightly worse?

* PR size. This is the big one! Should there be one PR per card/issue, or many tiny increments?

* Do you use/how do you use “draft” PRs? Are they for presenting ideas, or work in progress. What’s their lifespan?

* PR descriptions. Do you have a a standard template? What do you expect to see in a description?

* Do we use labels? If so, how?

* Are chained PRs allowed?

* “Fix in this PR” vs “I’ll add that in another PR”.

Merging:

* Squash, merge, or rebase into main?

* Request changes vs comment vs approve. What are the implications of each type of response?

* How do we request review (ask on Slack, auto-post, email notifications…)? Is a review open to all, or do you invite specific reviewers? What if you’re not invited but care?

* What’s the review process? What’s in scope? Do you value high level or low level comments, and when is each type appropriate?

* Minimum reviewers

* Does it need to be up-to-date with main before merge?

* Who decides if it *can* be merged? The author or the reviewer?

* Who merges the PR (again: author or reviewer)?

### Record your ways of working

Now you’ve figured out how you work, you’ll want to write it down. Without wanting to open another can of worms, there are a couple of qualities common to team charters which are actually read, honoured and evolved by teams I’ve worked with:

1. They’re short and concise. It feels good to write 2000 words on the primacy of meaningful commit messages, but think about your reader. A new team member doesn’t want to lose two weeks trawling a book on how they should collaborate. Brevity is key. Short documents are easier to scan, and brief (1 paragraph) points are more easily pointed to. If you *really *need to write more to explain your decision, capture this elsewhere (Decision Records are great for this).

1. Each point is linkable. Being able to point at a specific rule in a pull request comment or chat makes conversations more concrete, and lowers the barrier to entry for reading and following. Most wikis and markdown renderers add IDs to headings so you can link to a point in the document, for example [this rule](https://github.com/rubocop-hq/ruby-style-guide#indent-when-to-case) in the Ruby Style Guide on GitHub.

### Conclusion

Create a style guide for your ways of working, and encourage slow, thoughtful evolution over time. And don’t assume that what works well for your team is inherently the One True Way.

---

This post was originally published [on Medium](https://spikeheap.medium.com/pull-request-style-100-hills-to-die-on-703475d36d74).
