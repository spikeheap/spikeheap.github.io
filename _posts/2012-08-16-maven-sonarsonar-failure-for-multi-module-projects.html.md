---
author: spikeheap
comments: true
date: 2012-08-16 15:02:25+00:00
layout: post
slug: maven-sonarsonar-failure-for-multi-module-projects
title: Maven sonar:sonar failure for multi-module projects
wordpress_id: 71
categories:
- Posts
tags:
- maven sonar dev
---

After refactoring a small project to manage subversion auth information into multiple Maven modules I started running into what I assume is a fairly common problem: trying to build a child module which depends on an edit applied to a different module which hasn't been built yet. For some reason the "Set as main project" option has gone from Netbeans 7.2, so I found myself going back to the command line to build each time.

A couple of days later and I'm integrating the project with a local Sonar instance, only to find it fails with a similar message: 

```
[ERROR] Failed to execute goal on project XXXXXXXX: Could not resolve dependencies for project XXXXXXXX:XXXXXXXX:jar:1.0-SNAPSHOT: The following artifacts could not be resolved: XXXXXXXX, XXXXXXXX, XXXXXXXX: Could not find artifact XXXXXXXX:XXXXXXXX:jar:1.0-SNAPSHOT -> [Help 1]
```

A bit of digging turned up an issue which claims the problem is solved in Maven 3.2, but that didn't solve it for me. 

At least as an interim, packaging the project prior to running the Sonar plugin does the trick, ensuring that the relevant JARs are available for the sonar plugin's run:

```
mvn package sonar:sonar
```

Now the only problem is dealing with all the violations I've introduced, Bad Ryan!

