---
author: spikeheap
comments: true
date: 2010-11-24 17:09:32+00:00
layout: post
slug: checking-an-annotated-field-is-an-enum
title: Checking an annotated field is an enum
wordpress_id: 53
tags:
- java enum programming
---

Whilst building an annotation processor for a Seam/Wicket project I'm working on I needed to do a specific action if the annotated field was an `enum`. Thanks to autoboxing, I accomplished the task using the `getType()` method and comparing that `Class` object to the enum I was interested in. It did leave me with a big niggle though, and for the past couple of weeks I've been thinking about the following code:

```java
// Get the type of the field, as a Class object. Note we can't do instanceof on this, because it is a Class.
Class<?> type = field.getType();

//FIXME - make generic for any enum - this will work if we just change the catch criteria here.
if (type == OurEnumOne.class || type == OurClass.NestedEnumOne.class || type == OurEnumTwo.class) { ... }
```

It's horribly unmaintainable code for many reasons, but most unforgivably it won't match any other enums, so every time we want to add support for a new enum we need to modify the class this resides in - nasty!

At first this doesn't seem like it should be a problem, but the obvious solution (to get an instance of the field and just use `instanceof`) involves some convoluted reflection which will no doubt introduce bugs later on.

Fortunately, the real solution is a) more elegant, b) simpler, c) not likely to introduce bugs and d) applicable to all cases like this. Every class has an `isAssignableFrom(Class test)` method, which evaluates whether the calling class is a superclass or the same class as the test parameter, so the following returns true for any enum:

```java
if(Enum.class.isAssignableFrom(type)){ ... }
```

Thanks autoboxing!
