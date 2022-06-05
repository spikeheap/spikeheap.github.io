---
tags: 
  - engineering
  - guide
title: "Refactoring a directory into a git submodule"
date: 2013-08-16 18:10:00+00:00
comments: true
description: To release the Rsnapshot Puppet module I needed to extract the module directory from our entire Puppet configuration Git repository
---
To release the Rsnapshot Puppet module I needed to extract the module directory from our entire Puppet configuration Git repository (we know it's wrong, but it's how we started and are moving away from it slowly). Fortunately Git has some great functionality (hint: it's submodules) to allow the directory to be pulled out into a new repository, keeping the commit history. 

The steps I wanted to achieve were:

1. Create a new repository containing only the Rsnapshot directory (and the commit history for that directory).
2. Remove the directory from the Puppet repository and replace it with a pointer to the Rsnapshot repository.

[Git submodules](http://git-scm.com/book/en/Git-Tools-Submodules) solve this use-case. A submodule is treated as a separate repository, but resides within the parent repository's directory structure. 

The simplest way to filter the repository is to clone it, apply the filter to the clone and then push the the filtered repository to your origin server (if you use one). The following example assumes you've created an empty repository ready for the submodule:

``` bash
git clone $REPO_URL $SUBMODULE_NAME
cd $SUBMODULE_NAME
git filter-branch --subdirectory-filter '$PATH_TO_SUBMODULE' --prune-empty -- --all

# Clean the repository
git clean -xd -f

# Update the remote (replace "origin" with your remote name)
git remote rm origin
git remote add origin $SUBMODULE_REPO_URL

# Push the new submodule
git push origin master
```

All that's left to do then is remove the existing directory and add the submodule. Even if you're paranoid the removed directory's history is still in Git, so it's easy to roll back.

``` bash
git rm $PATH_TO_SUBMODULE
git commit -m "Removing directory to replace with submodule" $PATH_TO_SUBMODULE
git submodule add $SUBMODULE_REPO_URL $PATH_TO_SUBMODULE
git add .gitmodules $PATH_TO_SUBMODULE
git commit -m "Adding submodule X"
git push
```

For the Puppet example the repository resides at /etc/puppet and I used the following variables:

``` bash
SUBMODULE_NAME = puppet-rsnapshot
PATH_TO_SUBMODULE = modules/rsnapshot
```


# References

1. http://git-scm.com/book/en/Git-Tools-Submodules
2.  http://stackoverflow.com/questions/12514197/convert-a-git-folder-to-a-submodule-retrospectively
