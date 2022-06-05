---
author: spikeheap
comments: true
date: 2013-06-10 17:12:25+00:00
slug: setting-up-os-x-mountain-lion
title: Setting up OS X Mountain Lion
wordpress_id: 182
tags: 
  - guide
description: Last month I installed a second internal drive on my Macbook Pro to increase the capacity to nearly a terabyte. Foolishly forgetting that every time I reinstall the OS all the little tweaks from the past n months are forgotten
---

Last month I installed a second internal drive on my Macbook Pro to increase the capacity to nearly a terabyte. Foolishly forgetting that every time I reinstall the OS all the little tweaks from the past n months are forgotten.

To help me out next time, and for anyone who's interested, here's a quick run-down of the steps I took to go from vanilla OS X to a walking, talking personal machine capable of a bit of dev.

#### Update 2019-06-28

Six years later, I don't quite follow this process anymore. I now have a bootstrap script which I keep up to date: https://github.com/spikeheap/dotfiles.

### Getting things right in System Preferences
	
  * Set the dock size to small with a lot of magnification & auto-hide enabled
  * Language & Text: add "British English" to the list of languages
  * Security & Privacy: require password 5 mins after sleep. Turn on firewall
  * Energy saver: set to never sleep the computer for Power Adaptor, and turn off "put hard drives to sleep when possible" for both (I found this makes the laptop really sluggish for my day-to-day use)
  * Keyboard: Modifier Keys: Caps Lock to Command (Saves hitting caps lock by mistake)
  * Trackpad: tap to click, three finger drag, faster tracking speed, app expose
  * Mail: add personal Gmail account
  * Sharing: enable remote login and set hostname
  * Users: change login picture
  * Date & time: show date in menu bar
  * Dictation & Speech: turn on




### Add Google sync to Contacts app


In Contacts.app preferences -> Accounts -> On My Mac, check "Synchronize with Google" (Thanks to http://niklausgerber.com/blog/syncing-google-contacts-in-mountain-lion/ for this).


### Fixing hostname


In Terminal (and iTerm) I'd see "(null)" as my hostname. After a bit of Googling (sorry don't have the reference) I found the fix:

`sudo scutil --set HostName robin`



### Homebrew


I can't live without a package manager anymore, and have flitted between MacPorts and Homebrew. At the moment I'm liking Homebrew, so I need to install it before adding the following:



	
  * git
  * git-flow
  * bash-completion
  * play




### Must-have App Store apps


  * XCode
  * iPhoto
  * Camtasia
  * Pages
  * Pixelmator
  * Flow
  * Skitch
  * Twitter

###  Apps not in the App Store

  * Alfred
  * Google Chrome
  * 1Password
  * Dropbox
  * Google Drive
  * Textmate 2
  * Sublime Text
  * VLC
  * Little Snitch
  * Trim Enabler
  * Backblaze
  * Balsamiq
  * Byword
  * Eclipse
  * Netbeans
  * GPG keychain
  * Mac DVD Ripper Pro
  * Transmission
  * Transmission Remote GUI
  * VMWare Fusion
  * Skype
  * Latex


