---
author: spikeheap
comments: true
date: 2011-06-27 15:43:06+00:00
layout: post
slug: pfsense-and-virtualbox
title: pfSense and VirtualBox
wordpress_id: 50
description: "Thinking of installing pfSense on VirtualBox to test out the functionality. Great idea!"
---

Thinking of installing pfSense on VirtualBox to test out the functionality. Great idea! 

When you're setting up the network controllers, make sure to change them to Intel card emulators, because there's a bug in the FreeBSD driver for the non-Intel cards which makes them not work, but still appear in ifconfig.
