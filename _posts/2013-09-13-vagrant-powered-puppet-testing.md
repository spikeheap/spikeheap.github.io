---
layout: post
tags: ['post','technology','testing','configurationmanagement','puppet','vagrant','linux']
title: "Vagrant-powered Puppet testing"
date: 2013-09-13 18:39
comments: true
published: false
---

# Specification

Being good, I wrote this before I set about solving the problem. I'd love to say I always did it this way!


## Testing Puppet configurations

In order to test Puppet manifests and modules
As a Puppet administrator
I want to trivially create a local instance of the puppetmaster and virtual puppet clients with customisable node names


## Editing Puppet configurations

In order to write Puppet manifests and modules more quickly
As a Puppet administrator
I want to edit manifests locally


# Using Vagrant to provision a puppetmaster on OSX

## Prerequisites

1. [Vagrant](http://www.vagrantup.com/)
2. [Virtualbox](https://www.virtualbox.org/wiki/Downloads)
3. Puppet-lint

You can install Vagrant and Puppet-lint using gem:

```
sudo gem install vagrant puppet puppet-lint
```