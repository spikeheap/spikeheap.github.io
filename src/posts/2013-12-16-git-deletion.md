---
layout: post
tags: ['post','git', 'open source']
title: "Preparing a Git repository for open-sourcification"
date: 2013-12-16 19:48:40+00:00
comments: true
published: true
description: There's an easy way in Git to go through your history and remove the offending articles
---

A project I'm involved with is going through the process of being open-sourced and released on GitHub. This is a great development, but of course we have had to go through and make sure that we're able to release everything. The project started out life in a single Git repository so there's plenty of bootstrap data that's owned by other groups within the University. Fortunately there's an easy way in Git to go through your history and remove the offending articles. 

__Update 18/12/2013__ For those who don't want to re-clone their project, I've added the commands to flush the deleted refs from your local repository. I've also added a small section on identifying and removing space-hungry sections of the git repository.

There are many ways to achieve the same goal, and we could arguably have retained the same repository, however it's a nice opportunity to clear out the 300Mb which magically worked its way into the repository at some point and generally streamline our code.

##### A word of warning
The following will go through your entire tree and remove all references to the files you're removing, rewriting commits where necessary. As a result your local repository will likely wildly differ from the remote repository, so you'll need to coordinate this with your fellow team members. If your repository is already in the wild is there much point in causing this much pain? You can probably just get away with removing it from your tags and branches, which is far less invasive.

##### A second word of warning
This is a destructive process that rewrites history. __Make sure you've got a backup__ before attempting this, just in case things go pear-shaped.

__Update 18/12/2013__ GitHub's documentation is pretty thorough, so it wasn't surprising to find [a page on removing sensitive data](https://help.github.com/articles/remove-sensitive-data). I've updated this post to reflect some of the suggestions in that page.

The first thing to do is remove the offending content from your repository, and push that change. This is an important step because you want a commit at HEAD which isn't modified by the following actions, which allows other users to pull the changes without having to nuke their repository.

``` bash
git rm  path/to/our/secret/bootstrap-data/
git commit -m "Removing bootstrap data" path/to/our/secret/bootstrap-data/
git push
```

Then we can filter the commit history to remove the offending content from the history of all branches:

``` bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch path/to/our/secret/bootstrap-data/' --prune-empty --tag-name-filter cat -- --all
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

The next thing to do is purge it from the local repository by forcing a garbage collection, like so:

``` bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now
```

## Clearing large repositories
In our case, our project was around ~15Mb, however the repository had racked up over 300Mb. The obvious culprit is committed <code>target</code> directories, libraries and built WAR files.

To find out the size of your git repository, use <code>git count-objects -v</code> (you're looking for the size-pack value, which is the project size in kilobytes). 

Ted Naleid has written an excellent article on [finding and purging big files from git history](http://naleid.com/blog/2012/01/17/finding-and-purging-big-files-from-git-history), along with a couple of one-liners to get locate the biggest files. 

I've dumped the above into a little script:

```bash
FILE_TO_DELETE="target"

# Filter the history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch ${FILE_TO_DELETE' --prune-empty --tag-name-filter cat -- --all

# Purge the local repository and force garbage collection
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now

# Print new repository size
git count-objects -v
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
