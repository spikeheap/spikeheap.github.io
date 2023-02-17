---
title: "Incrementally linting a codebase with branch changes"
description: >-
  While working on a project with a long history, we wanted to introduce a linter, incrementally improving the code as we made changes.
tags: 
  - engineering
  - ruby
---
While working on a project with a long history, we wanted to introduce [Rubocop](https://rubocop.org) to lint the codebase. Being a large project, enforcing linting on the entire codebase wasn't feasible – thousands of offences and over a thousand that aren't auto-correctable.

😱

Instead of spending a soul-crushing few days trawling through the offences or blocking pull requests until it's all perfect, we can start by just improving the files we change. This is surprisingly high-value – the files we change regularly quickly become "standard" and the ones we never touch... well it doesn't matter if they're linted if we never look at them. 

Linting only the files that have changed is fairly straightforward. First we need to find the files that have changed (e.g. for the `develop` branch):

```bash
git diff --name-only develop
```
(thanks to [this StackOverflow answer](https://stackoverflow.com/a/10641400/384693))

Depending on our linter, we'll probably want to filter those files so we don't confuse it. Rubocop will attempt to parse things like `.erb`, and it won't have a good time. If we only want files that end with `.rb` we can use:

```bash
git diff --name-only develop | grep "\.rb$"
```

Then we can pass those files to Rubocop with `xargs`, which takes an input and appends it to the end of the command that follows. This leaves us with:

```bash
git diff --name-only develop | grep "\.rb$" | xargs rubocop -a
```

Then all that's left to do is commit the changes with a suitable emoji 😘.

## Why not use an editor extension?

Once you've got a consistently linted codebase it makes a lot of sense to use editor extensions for [EditorConfig](https://editorconfig.org), Rubocop, or your linter of choice. These will auto-lint or [highlight offences in your editor](https://marketplace.visualstudio.com/items?itemName=misogi.ruby-rubocop), which prevents us from adding non-compliant code in the first place.

However they're less helpful when you're introducing linting because auto-linting a file you've touched groups changes to code with linting modifications. This increases the complexity and cognitive load for both reviewers and future developers spelunking the codebase, possibly mid-way through debugging a tricky error. 

In this case it's friendlier to separate the Rubocop linting from other changes. This might mean separate PRs for linter fixes, or a separate commit in the same request.
