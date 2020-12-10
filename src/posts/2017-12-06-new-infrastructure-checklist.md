---
layout: post
tags: ['post', 'software', 'development']
title: "New project checklist"
description: "Starting a new software project? I use this checklist of tools and services to price up and plan a new project."
comments: true
published: false
date: '2017-12-06'
---
# TODO
I'd split the costs into two broad areas:

1. Things you need to run projects across a company.
2. Things you need to run this specific project.

This ends up being important because tools like JIRA, Confluence and GitHub should probably be shared across the whole organisation, and ensuring projects are managed consistently is key to getting them to not be a massive pain in future too!

So, my checklist of tools to enable new projects is:

1. Project Management tool. We'll need something to manage bugs, feature requests and ongoing development. JIRA is my go-to here because it's both powerful and flexible, but it can be a time sink if you're not careful with it. GitHub, GitLab, Basecamp and Trello are reasonable alternatives depending on your budget and how lightweight you want to be.
  > JIRA costs $10/month for small teams, $7/user/month otherwise
  > GitHub costs $9/user/month
  > GitLab is free for private projects 

2. Documentation system. We need a place to collaboratively edit documentation for projects. Confluence is the obvious choice is you're using JIRA. Other contenders are Google Docs, GitLab, Basecamp and GitHub.
  > Confluence costs $10/month for small teams, $7/user/month otherwise

3. Version Control System. GitHub is the obvious choice but private organisations aren't free. I've favoured GitLab for a few lower-budget projects and it worked very well, but there is an overhead in learning a new system, and most developers know GitHub.
  > GitHub costs $9/user/month for unlimited private repositories

4. Chat. This is particularly crucial if you have remote team members, but its also useful for office-based teams because you can post information from other systems and share decisions quickly. Slack seems to have won the market over, but HipChat and Gitter are alternatives.
  > Slack is free, or £5.25/user/month with unlimited searchable history


5. CI. We want to automate the build/test lifecycle for every project, so a central CI server is crucial. There are a plethora of different offerings available, but I've had positive experiences with CircleCI and CodeShip (the latter can work out quite expensive though). GitLab is also a strong contender here, particularly if you're using their suite for other aspects.
  > CircleCI is free for 1 container, and $50 for additional containers. This cost is centralised, so legacy projects can be built sporadically without requiring their own dedicated resources.
  > GitLab CI is free, and local workers can be added for the price of the resource.

There's a theme here: you can achieve everything you might need to do with free tooling. Paid alternatives may enable your team to work faster in some circumstances, but even low-budget projects can be managed properly!

### Per-project setup

With the organisation-level costs out of the way, the rest of the costs depend quite heavily on what resources the project needs.

The first two questions I'll ask are:

1. Can you cope with hardware failure? If the system can go offline for as long as it might take for you to restart (or rebuild) the infrastructure, you're fine. If not, you'll want load balancers, redundant servers for each service, and multi-AZ database. Note that this question is a little more nuanced for the database. Can you afford to lose or re-enter the data later? How about restoring from a backup up to 24 hours prior?

2. Do you need a staging environment. If the system integrates with anything, the answer to this is probably yes. A staging environment will need to be the same "shape" as production (e.g. multi-AZ), but can use lower-resourced compute units providing it doesn't starve the thing running on it.

With those two answers, this is the list of things I price up for a standard project (these usually comprise web server, worker servers, database):

- Compute. I tend not to go below AWS' t2.medium for EC2 instances because you can run out of CPU credits quite quickly. Reserved instances lower the cost substantially, but require up-front commitment.
  - t2.medium, 2 vCPU, 24 CPU creds/hour, 4Gb RAM
  $38.07 PAYG, $25.69 prepaid 1yr
  - t2.large, 2 vCPU, 36 CPU creds/hour, 8Gb RAM
  $77.30 PAYG, $51.29 prepaid 1yr
  - m4.large, 2 vCPU, 8Gb RAM
  $84.92 PAYG, $54.72 prepaid 1yr

- Database. Starting small and scaling as we need it is sensible, as we may never need the extra resource. Reserved instances are only valid across instance families, so it’s not possible to move from t2.medium and m4.large. As the t2.medium offers a saving of ~$40/month over the m4.large reserved pricing, it makes sense to start with t2.medium (pay-as-you-go). After 3-6 months a review should be carried out before converting to t2.medium reserved instances to save an additional $20/month. Prior to this, we’ll continuously monitor performance, and if we start to see scaling issues we can move to the m4.large reserved instances as soon as necessary.
  - db.t2.medium, 2-core, 4Gb RAM, moderate IO, burst CPU, 100Gb DB space.
    - Single-instance: $70.67/mo PAYG, $50.99 prepaid 1yr
    - Multi-AZ: $146.65/mo PAYG, $108.12 prepaid 1yr
  - db.m4.large, 2-core, 8Gb RAM, moderate IO, 100Gb DB space.
    - Single-instance: $165.10/mo PAYG, $110.84/mo prepaid 1yr
    - Multi-AZ: $335.51/mo PAYG, $226.91/mo prepaid 1yr

- Storage. S3 is cheap ($25/month for 1Tb), but you may need high-performance attached storage (SSDs, etc.).
- Networking. If a large amount of data is leaving AWS the charges may be non-0. Elastic Load Balancers are cheap (from a couple of pounds a month), but the price increases with use, so a popular service will have higher costs.
- Email. You organisation may provide email infrastructure. Amazon SES is a solid alternative, and works out approximately free for very small volumes of transactional email (password resets, etc.). Again, larger volumes increase the price, so think about the use case. AWS SES costs $0.10 per 1,000 messages sent or received.
- Backups. You can backup your data to S3 quite cheaply, or push it to Amazon Glacier to reduce the price further. 
- Logging. You can pay for a service such as PaperTrail, or log to Amazon CloudWatch. CloudWatch works out at about $10, but this depends on the number of metrics you post to it.
- Monitoring & alerting. Again, Amazon CloudWatch does most of what you need, for a very low price (generally free for small projects). New Relic is an invaluable tool if the service you're running is being actively developed or often suffers from bugs. The free tier is fine for non-critical projects, but the paid service can save a lot of developer time if things go wrong.

Things to think about (for the above list)
- Orchestration. Can you use Docker to share resources, or does it work out at 1:1 server:service?
- Versioning infrastructure changes. This could mean more repositories/CI jobs.

Finally, I like to think about the development environment up-front. This will often be based on Docker or Vagrant, but sometimes you need to provide development resources in the cloud, for example an anonymised version of the production database for performance testing. Some resources can be transient and just created when they're required. Others will need to be long-lived.
