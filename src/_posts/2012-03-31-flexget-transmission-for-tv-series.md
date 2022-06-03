---
author: spikeheap
comments: true
date: 2012-03-31 13:21:48+00:00
slug: flexget-transmission-for-tv-series
title: 'Downloading TV series with BitTorrent: getting The Daily Show and The Colbert Report in the UK'
wordpress_id: 112
post_format:
- Aside
description: For anyone with a basic knowledge of the Unix terminal, here’s a quick guide to getting the Daily Show with John Stewart and The Colbert Report onto your computer
---

For anyone with a basic knowledge of the Unix terminal, here’s a quick guide to getting the Daily Show with John Stewart and The Colbert Report onto your computer. The principle applies to pretty much any other series you might want to get hold of too. If you’re just wanting to watch the odd episode, or don’t want to record them all, a more appropriate article is available here.

**NOTE**: TV series (like films) have copyright, and by downloading an episode you may be breaching copyright law. I’m not advising you to flout copyright law, and you shouldn’t really use this method to get around paying for something!

It seems that living in the UK and watching political satire is not a compatible mix. Since More4 dropped the Daily Show the Radio Times have collected a petition to get it back to no avail. The Global Edition is still pumped out weekly, but that omits many of the best (and most incisive) bits. 

The problem, as the Radio Times article above explains, is that Channel 4 still own the rights to the Daily Show so they can show the Global Edition, so no-one else can pick it up (and why would they, only to compete with the Global Edition). It doesn’t look like this will change in the foreseeable future.

No problem (I thought), Comedy Central is available on Sky, which we joined around Christmas. Unfortunately even Comedy Central don’t think their show is good enough for the UK, so I’ve aggregated all the information I found about setting up an automatic BitTorrent server based on RSS feeds into these notes.



# Pre-requisites



This has been set up and tested on an Ubuntu server. The same steps should apply to most Linux distros, and can be fudged a bit to work on OSX. The system consists of two components, which I assume you’ve installed:





  1. Flexget to read the RSS feeds and download new episodes’ torrent files
  2. Transmission Daemon to download the torrent files



MediaTomb is a uPNP media server which can very easily watch the directories containing the downloaded episodes, which gives a very easy way to get the episodes onto your TV if you have an XBox, PS3 or uPNP capable device.
 


# Configuring Flexget



Create the locations you want to store the series. In this example I’ve used /var/torrented/Daily_Show and /var/torrented/Colbert_Report. Make sure they belong to the user who runs the Transmission daemon:


```bash    
    sudo chown  /var/torrented/Daily_Show
```

and

```bash  
    sudo chown  /var/torrented/Colbert_Report
```


Create the file ~/.flexget/config.yml. An example configuration is pasted below, and assumes you’re running Transmission on the same box. Make sure you don’t use tabs to indent the items, and use 2 spaces for each level of indentation. The USERNAME and PASSWORD variables are used to connect to Transmission, so you can pick whatever you like, as long as it matches the Transmission configuration lower down.


    
```
    presets:
      transmissionrpc:
        transmission:
          host: localhost
          port: 9091
          removewhendone: True
          username: 
          password: 
          ratio: 2.0
          addpaused: No
      tv:
        series:
          - The Daily Show:
              set:
                path: /var/torrented/Daily_Show
          - The Colbert Report:
              set:
                path: /var/torrented/Colbert_Report
        # configuration of quality parameters
        # -> I don't need the 720p files > 1 GB in size
        quality: hdtv
    
    feeds:
      EZRSSDaily:
        rss: http://www.ezrss.it/search/index.php?show_name=The+Daily+Show&show_name_exact=true&mode=rss
        preset:
          - transmissionrpc
          - tv
        priority: 10
      EZRSSColbert:
        rss: http://www.ezrss.it/search/index.php?show_name=The+Colbert+Report&show_name_exact=true&mode=rss
        preset:
          - transmissionrpc
          - tv
        priority: 10
```   



You can test the configuration without actually downloading the torrents by running


    
    flexget --test



You then need to add Flexget to your crontab (crontab -e). Add an entry such as the following:


    
    
    # m h dom mon dow command
    0 * * * * su mediatomb -c /usr/local/bin/flexget --cron
    



I would also recommend removing old episodes so they don’t just fill up your hard drive by adding the crontab entries below. The “-mtime +14″ parameter limits the find to files older than 14 days, obviously you can tweak this to meet your requirements.

    
    
    # Remove old Daily Show and Colbert Reports
    0 0 * * * find /var/torrented/Daily Show/ -type f -mtime +14 -exec rm {} \;
    0 0 * * * find /var/torrented/Colbert_Report/ -type f -mtime +14 -exec rm {} \;
    


	


# Configuring Transmission



On Ubuntu the Transmission daemon configuration file is stored in /etc/transmission-daemon/settings.json. The contents of the file can be replaced with the contents below:


    
    
    {
        "alt-speed-down": 50, 
        "alt-speed-enabled": true, 
        "alt-speed-time-begin": 540, 
        "alt-speed-time-day": 127, 
        "alt-speed-time-enabled": true, 
        "alt-speed-time-end": 1380, 
        "alt-speed-up": 50, 
        "bind-address-ipv4": "0.0.0.0", 
        "bind-address-ipv6": "::", 
        "blocklist-enabled": false, 
        "blocklist-url": "http://www.example.com/blocklist", 
        "cache-size-mb": 4, 
        "dht-enabled": true, 
        "download-dir": "/var/torrented", 
        "download-limit": 3, 
        "download-limit-enabled": 1, 
        "encryption": 1, 
        "idle-seeding-limit": 3, 
        "idle-seeding-limit-enabled": false, 
        "incomplete-dir": "/var/torrented/", 
        "incomplete-dir-enabled": false, 
        "lpd-enabled": false, 
        "max-peers-global": 200, 
        "message-level": 2, 
        "peer-congestion-algorithm": "", 
        "peer-limit-global": 240, 
        "peer-limit-per-torrent": 60, 
        "peer-port": 51413, 
        "peer-port-random-high": 65535, 
        "peer-port-random-low": 49152, 
        "peer-port-random-on-start": false, 
        "peer-socket-tos": "default", 
        "pex-enabled": true, 
        "port-forwarding-enabled": false, 
        "preallocation": 1, 
        "prefetch-enabled": 1, 
        "ratio-limit": 2, 
        "ratio-limit-enabled": true, 
        "rename-partial-files": true, 
        "rpc-authentication-required": true, 
        "rpc-bind-address": "0.0.0.0", 
        "rpc-enabled": true, 
        "rpc-password": "", 
        "rpc-port": 9091, 
        "rpc-url": "/transmission/", 
        "rpc-username": "", 
        "rpc-whitelist": "127.0.0.1,192.168.0.*", 
        "rpc-whitelist-enabled": true, 
        "script-torrent-done-enabled": false, 
        "script-torrent-done-filename": "",
        "speed-limit-down": 100, 
        "speed-limit-down-enabled": false, 
        "speed-limit-up": 100, 
        "speed-limit-up-enabled": false, 
        "start-added-torrents": true, 
        "trash-original-torrent-files": true, 
        "umask": 18, 
        "upload-limit": 100, 
        "upload-limit-enabled": 0, 
        "upload-slots-per-torrent": 14, 
        "utp-enabled": true, 
        "watch-dir": "/var/torrents_to_download", 
        "watch-dir-enabled": "true"
    }
    


	
	
**Important**: Don’t restart Transmission once you’ve updated the settings.json file. Transmission writes its settings on exit, so you’ll just lose your modifications. Instead, either stop Transmission before editing the file, or use “reload” to get Transmission to reload the configuration before restarting.

A couple of notes about the configuration above:




  1. Make sure the  and  variables are replaced with whatever username and password you used in Flexget. You can also use these credentials to connect with the Transmission Remote GUI. When you exit Transmission it will replace your password with an encrypted version of it.
  2. If you want to connect to Transmission using the Remote GUI from a different machine, you need to update the “rpc-whitelist” to include the IP range you’ll connect from (here it’s preset at 192.168.0.1-255).
  3. The “watch-dir” and “watch-dir-enabled” settings at the bottom of the file allow you to drop torrent files into the watched directory and Transmission will automatically add them to the download queue.
  4. The “ratio-limit” is set at 2.00, which means the torrent will only seed to a ratio of 2, and will then be stopped and marked as completed. Once it’s marked as completed it will be removed by Flexget next time it runs.
  5. This configuration uses the full bandwidth available between 11PM and 9AM. During the day the connection speed is limited to 50Kbps up and down.



At this point you’re ready to go!
