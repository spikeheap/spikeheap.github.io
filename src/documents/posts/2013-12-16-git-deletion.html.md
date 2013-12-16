---
layout: post
tags: ['post','git', 'open source']
title: "Preparing a Git repository for open-sourcification"
date: 2013-12-16 19:48:40 +0000
comments: true
published: true
---

A project I'm involved with is going through the process of being open-sourced and released on GitHub. This is a great development, but of course we have had to go through and make sure that we're able to release everything. The project started out life in a single Git repository so there's plenty of bootstrap data that's owned by other groups within the University. Fortunately there's an easy way in Git to go through your history and remove the offending articles. 

There are many ways to achieve the same goal, and we could arguably have retained the same repository, however it's a nice opportunity to clear out the 300Mb which magically worked its way into the repository at some point and generally streamline our code.

##### A word of warning
The following will go through your entire tree and remove all references to the files you're removing, rewriting commits where necessary. As a result your local repository will likely wildly differ from the remote repository, so you'll need to coordinate this with your fellow team members. If your repository is already in the wild is there much point in causing this much pain? You can probably just get away with removing it from your tags and branches, which is far less invasive.


``` bash
git filter-branch --tree-filter 'rm -rf path/to/our/secret/bootstrap-data/' HEAD
```

Because you've just rewritten history, the <code>git status</code> command will then yield something like

```
# On branch develop
# Your branch and 'origin/develop' have diverged,
# and have 373 and 372 different commits each, respectively.
#   (use "git pull" to merge the remote branch into yours)
#
nothing to commit, working directory clean
```

<!-- TODO Overwriting history, or pushing a new repository -->

## Reapplying commits
It's almost certainly the case that someone cloned your repository and made some changes while you were off rewriting history. If you're now working on a new repository, the easiest way might be to create a patch from the old repo and then apply it to the new one. Using the following command, "-1" refers to the last 1 commit, so you can use "-2", "-3", and so on.

``` bash
# Make a patchfile 
git format-patch -1

# Apply the patchfile
patch -p1 < file.patch
```

And voila, you're back up and running again. Of course there's plenty more to do: adding a permissive license, attributing any libraries and most importantly building a pretty website for it...