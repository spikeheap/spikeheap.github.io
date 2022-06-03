---
author: spikeheap
comments: true
date: 2012-04-04 15:04:39+00:00
slug: blogging-about-software-using-textmate
title: Blogging about software using Textmate
wordpress_id: 129
description: I'm trying to force myself to be a better contributor to the software development community, and part of that is writing up my rough notes each time I solve an interesting technical problem
---

I'm trying to force myself to be a better contributor to the software development community, and part of that is writing up my rough notes each time I solve an interesting technical problem.

To do that I'm using this Wordpress blog, and Textmate because it makes me far more likely to write the article in the first place. It also solves a problem I've had a few times where formatting or source is changed once you upload the article, and by keeping a local copy for the draft I've always got something to go back to. 

The only problem then is posting source code, which this post is simple test for. If the following works:

```
Title: Blogging about software using Textmate
Slug: blogging-about-software-using-textmate
```

then source code formatting works from Textmate, and on to the next challenge!

To blog to Wordpress using Textmate, you first need to add your blog to the bundle's settings. Once you've done that, Ctrl-Shift-Alt-B will tell Textmate to treat your document as a Markdown blog post. From there I've added the following:

```
Title: Blogging about software using Textmate
Slug: blogging-about-software-using-textmate
```

I've then added source code using the great SyntaxHighlighter plugin by wrapping the code in **sourcecode** tags.

Finally I've posted this article to the blog using Ctrl-Command-P. Onwards.
