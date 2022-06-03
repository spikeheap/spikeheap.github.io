---
author: spikeheap
comments: true
date: 2012-04-05 14:47:58+00:00
slug: maybe-my-search-4-2
title: Using JIRA to manage a skills registry
wordpress_id: 158
post_format:
- Aside
tags:
- jira
- project-management
- skills
- training
description: Maybe my search-foo isn't what it used to be, but it seems that there's no standard method for recording employee's skills and training requirements against a central skill set. Our ISO 17025 accreditation requires our skills matrix to be audited, and we need to use it to prove that everyone has the necessary skills to carry out the tasks they're assigned
---

Maybe my search-foo isn't what it used to be, but it seems that there's no standard method for recording employee's skills and training requirements against a central skill set. Our ISO 17025 accreditation requires our skills matrix to be audited, and we need to use it to prove that everyone has the necessary skills to carry out the tasks they're assigned.

Up until recently, this hasn't been a problem, but (as with everything) there comes a point where Excel just doesn't cut it! After scouring the Internet for an open-source, automated solution, I've decided to try implementing it in JIRA, our project management tool of choice.

**Note** I should probably mention here that I'm a huge advocate of JIRA. We've been through a few project management tools over the years and have settled on JIRA as the most flexible and powerful option available. If you ever meet me it's good not to mention project management tools because I _will_ go off on a discourse about auditable task management, and no-one wants that.

To achieve this we went through and set up a custom "user picker" field named _Employee_. We then added each competency as a component, and made both required fields. We also created a "Training" issue type so we can list the training more easily in searches and reports.

A quick run through the Field Configuration pages to hide all the unwanted fields, and an additional Issue Type Screen Scheme to display things in the right order, and we're good to go:

![Image](/images/2012-04-05-using-jira-to-manage-a-skills-registry-jira.jpg)

If anyone knows of an easier way to achieve the same thing I'm all ears. Total time invested in the prototype with a few different components: 20 minutes.
