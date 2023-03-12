---
title: "Incrementally linting a codebase with branch changes"
description: >-
  While working on a project with a long history, we wanted to introduce a linter, incrementally improving the code as we made changes.
tags: 
  - engineering
  - ruby
---
**Update 26th February 2023:** replaced `xargs` approach because it interfered with Pry local debugging.

While working on a project with a long history, we wanted to introduce [Rubocop](https://rubocop.org) to lint the codebase. Being a large project, enforcing linting on the entire codebase wasn't feasible – thousands of offences and over a thousand that aren't auto-correctable.

😱

Instead of spending a soul-crushing few days trawling through the offences or blocking pull requests until it's all perfect, we can start by just improving the files we change. This is surprisingly high-value – the files we change regularly quickly become "standard" and the ones we never touch... well it doesn't matter if they're linted if we never look at them. 

Linting only the files that have changed is fairly straightforward. First we need to find the files that have changed (e.g. for the `main` branch). We can do this with `git diff` and filter for `A`dded, `M`odified, and `R`enamed files:

```bash
git diff --name-only --diff-filter=AMR main...
```
(thanks to [this StackOverflow answer](https://stackoverflow.com/a/10641400/384693)) for inspiration.

Depending on our linter, we'll probably want to filter those files so we don't confuse it. Rubocop will attempt to parse things like `.erb`, and it won't have a good time. If we only want to process files that Rubocop thinks it can handle we can use:

```bash
rubocop --only-recognized-files --autocorrect -- file_a.rb file_b.rb
```

We can put this together to get a one-line command that runs Rubocop over any files that have been added, modified, or renamed:

```bash
rubocop -a --only-recognized-files $(git diff --diff-filter=AMR --name-only main...)
```

> An early version of this approach used `xargs` to pass files, however this doesn't always play nicely with [Pry](https://github.com/pry/pry), rending the breakpoint non-interactive. I didn't get to the bottom of that, let me know if you have any ideas on [Mastodon](https://ruby.social/@spikeheap).

Then all that's left to do is commit the changes with a suitable emoji 😘.

## Why not use an editor extension?

Once you've got a consistently linted codebase it makes a lot of sense to use editor extensions for [EditorConfig](https://editorconfig.org), Rubocop, or your linter of choice. These will auto-lint or [highlight offences in your editor](https://marketplace.visualstudio.com/items?itemName=misogi.ruby-rubocop), which prevents us from adding non-compliant code in the first place.

However they're less helpful when you're introducing linting because auto-linting a file you've touched groups changes to code with linting modifications. This increases the complexity and cognitive load for both reviewers and future developers spelunking the codebase, possibly mid-way through debugging a tricky error. 

In this case it's friendlier to separate the Rubocop linting from other changes. This might mean separate PRs for linter fixes, or a separate commit in the same request.

## Continuous Integration is your friend

Once the team is able to lint the codebase locally and apply fixes, the next step is to add that linting to your CI service to validate that pull requests consistently improve the codebase. 

Depending on your CI service, you _may_ want to make those checks non-blocking to start with. Your teammates who make a one line change in _that_ thousand line file will be thankful!

We need to make our CI script a little smarter than the one we've been running locally, because branches with no additions, modifications or removals will cause Rubocop to run over the entire codebase. There are a bunch of scenarios where this is true, for example removing legacy unused code or renaming a bunch of files.

To work around this we can check to see whether the list of changed files is empty before passing it to Rubocop:

```bash


CHANGED_FILES=$(git diff --diff-filter=AMR --name-only main...)

# -n checks whether the list of changed files is null, to prevent Rubocop from running over
# the _whole_ codebase if we've only removed files from the branch
[ -n "$CHANGED_FILES" ] && bundle exec rubocop --only-recognized-file-types $(echo $CHANGED_FILES)

