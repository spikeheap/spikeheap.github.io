---
author: spikeheap
comments: true
date: 2010-08-19 06:31:41+00:00
slug: mythtv-remote-x10
title: Mythtv Remote X10
wordpress_id: 28
tags: 
  - guide
description: I have an ATI Remote Wonder remote, which I've been quite happy with for the last couple of years. Not that happy though (or maybe I just like tinkering), because I set about trying to make the remote more responsive
---

I have an ATI Remote Wonder remote, which I've been quite happy with for the last couple of years. Not that happy though (or maybe I just like tinkering), because I set about trying to make the remote more responsive. There's something about having to keep letting go of the button and waiting for it to accept a new press that winds me up when I'm trying to watch a film... 

The default lirc  configuration file is an immense improvement in Mythbuntu Lucid, but I started hacking around anyway. 

First off was to try the kernel drivers for the X10, which worked, but I couldn't get any of my lirc settings to affect its behaviour. Switching to the `X10 (userspace)` drivers made the remote more responsive (and generated *many* more button presses in irw.

I now have the standard `ati_remote_wonder_rf `configuration running with one slight tweak - I have changed the repeat rates in `~/.lirc/mythtv `to 5 (from 0). 

Now it behaves like a remote should - and is quick enough for me anyway.
