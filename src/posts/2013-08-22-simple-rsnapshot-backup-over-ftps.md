---
layout: post
tags: ['post','technology','backup','rsnapshot','linux']
title: "Simple Rsnapshot backup over FTPS"
date: 2013-08-22 20:39:00+00:00
comments: true
description: In this post I'll walk you through setting up a simple backup solution using Rsnapshot and CurlFTPfs to retrieve files from an FTP/FTPS server. The result is a flexible backup solution with multiple retrieval points.
---
In this post I'll walk you through setting up a simple backup solution using Rsnapshot and CurlFTPfs to retrieve files from an FTP/FTPS server. The result is a flexible backup solution with multiple retrieval points.

*Note that while this example will work with FTP it is not recommended because the protocol is not encrypted.*

**Update 23/08/2013:** There were a hundred other things I wanted to talk about in this post but decided to leave out for the sake of simplicity, but as [@m0untainpenguin](https://twitter.com/m0untainpenguin) [points out](https://twitter.com/m0untainpenguin/statuses/370901452648374272) the feeling of safety that hard links give you is misleading. There is only ever one copy of the file on disk, so if that gets corrupted you're out of luck. A great reason to do regular full backups, but that's a walkthrough for another post!

I have tested this on a clean installation of Ubuntu 13.04, but let me know if anything doesn't work as expected in the comments.

**Many of the commands within this tutorial must be executed as root. You can always just add "sudo" in front of it if you have problems.**

# A simple FTP server for testing

While not technically part of the setup, I didn't have ready access to an FTP server to test these notes. Installing an FTP server for testing is as simple as:

```bash
apt-get install vsftpd
```

Out of the box, vsftpd serves your home directory and can be connected to using your standard username and password.

**Installing an FTP server with access to your home directory is a pretty bad idea without [configuring it properly](https://help.ubuntu.com/community/vsftpd#TLS.2BAC8-SSL.2BAC8-FTPS)**

# Users and groups

We don't want the backup to run as root because it's always a good idea to restrict things as much as possible, so let's create a backup user and group:

```bash
addgroup backup
adduser rsnapshot --ingroup backup --disabled-password
```

# Mounting an FTP folder locally

[CurlFTPfs](http://curlftpfs.sourceforge.net/) presents the FTP server as a local directory using FUSE. It's trivial to install it:

```bash
apt-get install curlftpfs 
```

We want to connect to our remote server using credentials, so let's add that to the *.netrc* file in the home directory of the backup user:

```bash
cat << EOF > /home/rsnapshot/.netrc
machine ftp.host.com  
login myuser  
password mypass 
EOF

# Don't let anyone else see your FTP credentials
chmod 600 /home/rsnapshot/.netrc
```
 
Mounting the remote directory is also straightforward, here we'll use /media/remote\_server. Note that by default the directory is only accessible to the user who mounted it.

```bash
mkdir /media/remote_server
chown rsnapshot /media/remote_server

# Ubuntu doesn't have the right permissions on /etc/fuse.conf, so let's fix that
chmod 644 /etc/fuse.conf
```

Mounting and unmounting is easy:

```bash
# mount
curlftpfs ftps://ftp.host.com /media/remote_server -r -o ssl

# unmount
fusermount -u /media/remote_server
```

Now you have the remote folder mounted locally we can move on to the backup solution.

# Rsnapshot configuration
Right, we'll need to install Rsnapshot first.

```bash
apt-get install rsnapshot
```

We're going to keep our backups in */var/rsnapshot* for this example, but feel free to put them wherever you like:

```bash
mkdir -p /var/rsnapshot/private/snapshots
chmod 0700 /var/rsnapshot/private
chmod 0755 /var/rsnapshot/private/snapshots
chown -R rsnapshot /var/rsnapshot/
```

While we're at it, let's touch the log file and lock directory:

```bash
touch /var/log/rsnapshot.log
chown rsnapshot /var/log/rsnapshot.log
mkdir /var/run/rsnapshot/
chown rsnapshot /var/run/rsnapshot/
```

Next we need to set the configuration file. There are many options, so it's a good idea to [read the documentation](http://www.rsnapshot.org/rsnapshot.html), but this will get you up and running:

```conf
#################################################
# rsnapshot.conf - rsnapshot configuration file #
#################################################
#                                               #
# PLEASE BE AWARE OF THE FOLLOWING RULES:       #
#                                               #
# This file requires tabs between elements      #
#                                               #
# Directories require a trailing slash:         #
#   right: /home/                               #
#   wrong: /home                                #
#                                               #
#################################################

config_version	1.2

snapshot_root	/var/rsnapshot/private/snapshots
no_create_root	1

cmd_cp		/bin/cp
cmd_rm		/bin/rm
cmd_rsync	/usr/bin/rsync
#cmd_ssh	/usr/bin/ssh

cmd_logger	/usr/bin/logger
cmd_du		/usr/bin/du
cmd_rsnapshot_diff	/usr/bin/rsnapshot-diff

# Specify the path to a script (and any optional arguments) to run right
# before rsnapshot syncs files
#
#cmd_preexec	/path/to/preexec/script

# Specify the path to a script (and any optional arguments) to run right
# after rsnapshot syncs files
#
#cmd_postexec	/path/to/postexec/script


#########################################
#           BACKUP INTERVALS            #
# Must be unique and in ascending order #
# i.e. hourly, daily, weekly, etc.      #
#########################################

retain		hourly	24
retain		daily	7
retain		weekly	4
retain		monthly	60

verbose		2
loglevel	3
logfile	/var/log/rsnapshot.log

lockfile	/var/run/rsnapshot/rsnapshot.pid
stop_on_stale_lockfile		0

link_dest	1
sync_first	1

###############################
### BACKUP POINTS / SCRIPTS ###
###############################

# LOCALHOST
#backup	/home/		localhost/
#backup	/etc/		localhost/

# Remote SFTP site
backup	/media/remote_server		remote_server/
```

Now we can test the configuration (be sure to run as the rsnapshot user):

```bash
rsnapshot -t sync
```

We could run it without *-t* to carry out a backup, however that'll fail right now because the FTP directory isn't mounted (yet).

We want to mount the FTP folder every time we do a backup, so we'll need a wrapper script to do that (/var/rsnapshot/doftpsync.sh):

```bash 
#!/bin/sh
# -r = mount read-only
# -o ssl = Force SSL
echo Mounting the FTP servr
curlftpfs ftps://ftp.host.com /media/remote_server -r -o ssl

# Do some backup here :)
#echo performing the backup
/usr/bin/rsnapshot sync

# Finally, unmount and disconnect from the FTP server
fusermount -u /media/remote_server
```

Make the script executable:

```bash
chmod 755 /var/rsnapshot/doftpsync.sh
```

And finally run the script to test it. Check the contents of /var/rsnapshot/private/snapshots to check it worked as expected.
# Running regularly with cron

As the backup user, let's execute the Rsnapshot command at the relevant intervals using cron. To edit the user's crontab just use:

```bash
su - rsnapshot
crontab -e
```

And add in the following commands (feel free to change the intervals to meet your needs of course):
 
```bash
# You only need to run 'sync' if the 'syncfirst' option is true
0 * * * *       /var/rsnapshot/doftpsync.sh

# Every hour on the 50th minute
50 * * * *       /usr/local/bin/rsnapshot hourly
# Once a day at 23:40
40 23 * * *       /usr/local/bin/rsnapshot daily
# Every Sunday at 23:30
30 23 * * 0       /usr/local/bin/rsnapshot weekly
# The first day of every month at 23:20
20 23 1 * *       /usr/local/bin/rsnapshot monthly
```


# Mounting a read-only backup for recovery (optional)

Having a read-only copy of your backup is a great idea. Having one that even root can't write to is even better. How much less stressful is it when you never have to think "damn, I copied that the wrong way and overwrote the backup". Fortunately it's easy to do with NFS (this is largely adapted and taken from the [Rsnapshot HOWTO](http://www.rsnapshot.org/howto/1.2/rsnapshot-HOWTO.en.pdf)). 

First we need to create a location to mount the read-only snapshots and modify the permissions so that no-one but the rsnapshot user can look inside the private directory:

```bash
mkdir /var/rsnapshot/readonly
chmod 0755 /var/rsnapshot/readonly
```

Then we add the NFS export of our private directory to */etc/exports*:

```bash
/var/rsnapshot/private/snapshots/ 127.0.0.1(ro,no_root_squash)
```

You'll need to restart the NFS service now:

```bash
service nfs restart
```

Now we have the NFS export, we can mount it. Add the following to */etc/fstab*:

```bash
localhost:/var/rsnapshot/private/snapshots/ /var/rsnapshot/readonly/ nfs ro 0 0
```

Finally you can mount the directory:

```bash
mount /var/rsnapshot/readonly/
```

And of course, to test! Try creating a file inside the */var/rsnapshot/readonly/* directory and watch it fail.

# Summary

You should now have a fully fledged enterprise-grade backup system making a backup of your hosted data, but there's no time to rest! Encrypting your external drive is a great idea, just in case it gets stolen. 

Of course you could always automate most of the above installation (and maintenance) by using Puppet and the [Rsnapshot module](https://github.com/spikeheap/puppet_rsnapshot). 
