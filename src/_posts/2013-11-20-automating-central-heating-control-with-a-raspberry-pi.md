---
tags: 
  - update
title: "Plans for automating central heating control with a Raspberry Pi"
date: 2013-11-20 9:32:00+00:00
comments: true
published: true
description: Moving into a stone-built cottage with single glazing and bottled gas central heating has been a (good) learning experience.
---
Moving into a stone-built cottage with single glazing and bottled gas central heating has been a (good) learning experience. Fortunately we have a combi-boiler so have on-demand hot water, but the central heating timer cuts power to the boiler so no heating = no hot water. Also, the thermostat is by the front door, so provides a wildly different temperature from the rooms! My project is to hack into the thermostat and replace it with a raspberry pi providing timed heat as well as using information from a wireless thermometer located nearby, and then to add some intelligence to try to save money and the environment. 

I was inspired to build this after David Hunnisett gave a presentation at a Bangor software developers lightning lunch. His project was to hack his wireless thermostat and use a BeagleBone to figure out whether anyone was in the house (or returning home) based on their personal devices network presence. Pretty cool stuff. This is a little more basic, and I'll be happy if we just get the following:

* Web-based switching 
* 7-day programs with multiple heating times per day
* Switching tolerance (my previous thermostat would sit there clicking while the temperature hovered around the switching point)
* Minimum temperature override using the existing thermostat (so the pipes don't freeze if the Pi dies)

Of course once you've got control of the heating system and a connection to the network you can think about automating a raft of other things, for example:

* Grab your work schedule from Google Calendar and automatically switch the heating off when you're at work (and on when you're heading home)
* Provide an interface to turn the heating on/off from anywhere in the world with an internet connection
* Record how long the heating has been on, and estimate gas usage. We only use gas for heating, obviously it's harder to do it you're cooking with gas too :)

A couple of friends founded the amazing [OpenEnergyMonitor project](http://openenergymonitor.org/emon/) in North Wales, and Glyn's enthusiasm for this sort of thing is infectious. Once I've got a basic system up and running the next logical step is to collect usage data for the other parts of the house, and tie it all together with things like outside temperature and humidity. There's (almost) nothing I love more than stats, so this project will be like Christmas!

# Why am I doing this? Why not just buy a Nest? 

Okay, I'm sure this project will end up being like my first foray into building a MythTV media server 8 years ago and will take more time and money than buying an off-the-shelf solution, but that's not my motivation. My primary reason for doing this is that there's something really cool (pun intended) about interacting with the real-world with software, and the (hopefully) satisfaction of hearing the heating click to life because of a piece of code I've written is pretty inspiring.

Secondly, information is king. I want to be able to get at everything later and see what my house has been doing. Most proprietary systems lock you in and only let you do what they want you to do. 

Finally, if I can complete this and package it into something that's useful enough for someone else to hack on, all the better. The Pi-powered thermostat interface problem seems to have been solved many times, but the software to sit on top of it seems less readily available.

# Phase 1: hacking into the existing system
My background is in software engineering and networking, so because I see the electronics and physical side of this as the biggest challenge I'm tackling that first. Fortunately there's a wealth of information about this exact use-case on the Internet (if only I had internet at home!).

The first thing I did was to open up the thermostat to find out what terminals were available. Mine has 4, including 1 earth and 1 live. I'll kno a bit more once my multimeter comes back from storage in a week or so.

Thanks to [@GlynHudson](http://twitter.com/glynhudson) I cut out needing to solder my own relay board for the Raspberry Pi and ordered the following to go with my existing Pi, SD card and power adaptor:

* Slice of Relay expansion board for the Pi from Ciseco
* WiPi wireless USB dongle, so it can talk to the house network
* Real Time Clock module with combined thermometer, to allow the Pi to act as a thermostat and remain on-track even when the network is down

My original plan had been to use a latching (bistable) relay so the Pi didn't need to apply current constantly, but decided a fail-safe option is better, and if the Pi dies so will the heating, rather than using up all my gas!

Once those components turn up (and I get some time), I'll let you know how it's going.

<!--
* The existing thermostat
* Switching 220V with a Pi (and starting with a prototype)
-->
