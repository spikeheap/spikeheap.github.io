---
layout: post
tags: ['post','technology', 'git', 'grails', 'sonar', 'development']
title: "Setting up Grails code quality tools with local Sonar"
date: 2013-11-21 13:25
comments: true
published: true
---

We want to be able to measure code quality for a Grails/Javascript project I've just joined. I have had good experiences with Sonar before, so set out to get the important (to me) metrics from one into the other:

* Code coverage
* Complexity
* Duplicated code
* Code violations (poor coding constructs)

Despite a load of Google results suggesting it would be impossible (or at least quite hard), it turned out to be relatively straightforward.

<!-- more -->


## Setting up Sonar 

Install sonar using brew:
```bash
brew install sonar sonar-runner
```

To have launchd start sonar at login:
```bash
ln -sfv /opt/boxen/homebrew/opt/sonar/*.plist ~/Library/LaunchAgents
```

Then to load sonar now:
```bash
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.sonar.plist
```

You can check it's running at http://localhost:9000/, but you can use nginx to give you a prettier URL (I'll cover that in a later post). While you're at it **change the default "admin" user password from "admin"**.

## Adding Maven to the Grails project to run Sonar

We need to set up Maven to post the results to Sonar. Because we don't want local machine configuration included in the project Git repository, let's add the database connection details to our local Maven settings file (~/.m2/settings.xml) which may not exist yet, so just create it with the following contents:

{% gist spikeheap/7563286 %}

The important elements to check are:

* sonar.host.url, which should be "http://localhost:9000" unless you're proxying through nginx
* sonar.jdbc.url and ensure that database actually exists (I use postgres, pick your own flavour)
* sonar.jdbc.username
* sonar.jdbc.password

You then need to add a pom.xml file to the project you want to analyse:

{% gist spikeheap/7564644 %}

Here the points of interest are:

* groupId
* artifactId
* name
* sources, ensuring all your source code is under inspection

You can test for success by running "mvn sonar:sonar -DskipTests=true" in the same directory as the pom.xml file. All things being equal it will show "Build Success" on the command line and populate your Sonar installation with a project.

Note that this only does analysis of the Groovy files, and analyses the Java source using the Groovy rules. Newer versions of Sonar support multi-language projects, but in a fairly awkward way. Perhaps over the weekend I'll get a chance to include some Javascript code quality too.

When I next get a few minutes I'm going to get this set up in Jenkins and tie it all together with nginx, and possibly write about how we're automating it all with Boxen. Until the next time...

