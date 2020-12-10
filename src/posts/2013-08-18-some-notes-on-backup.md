---
layout: post
tags: ['post','technology','backup','rsnapshot','linux']
title: "Some notes on backup"
date: 2013-08-18 18:18:00+00:00
comments: true
---

I've been extolling the virtues of backup a lot recently, which has led to a few interesting conversations (and a lot of people rolling their eyes and going back to talking about climbing). 

One of these conversations was with [Glyn](https://twitter.com/glynhudson) from the amazing [Open Energy Monitor project](http://openenergymonitor.org/emon/), who are wrestling with a backup implementation for their forums. Their requirements are very similar to a lot of small businesses who rely on hosted solutions, so in this post I'm going to talk about small-scale backup strategies and give some suggestions on how to approach the task. 

In a following post I will describe how to set up a simple backup solution using Rsnapshot for machines which don't have SSH or rsync available.
<!-- more -->

# How much protection?
A good place to start is figuring out the level of backup you actually need. There are a couple of industry terms which are worth considering here:

1. **Recovery Point Objective (RPO)** This is *maximum* amount of data you can afford to lose if the system fails and you have to fall back to the backups, for example it might be acceptable to lose up to a couple of hour's changes for a static image directory on a forum. The same isn't true for an online ordering system, where losing more than the last 10 minutes might be catastrophic.
2. **Recovery Time Objective (RTO)** This is the *maximum* length of time it can take to restore a service from the backup. Again this varies wildly by application, and the cost of losing an e-commerce site for even 5 minutes may be unacceptable while it might be okay to take up to a day to restore a development environment. 

Once you've defined your RTO and RPO for each service you're aiming to protect you're in a good position to decide on your backup and recovery strategy. If you've decided that you have an RPO of less than 30 minutes and an RTO of less than 1 hour you the solutions described below aren't suitable for you. Take some time to look up [high availability clusters](https://www.google.co.uk/search?q=high+availability+cluster), [live database replication](https://www.google.co.uk/search?q=mysql+active-active+replication), or a plethora of other options. 

# How many backups do I really need?
The first thing most people do when realising they need a backup is to copy their files to a USB pen drive or another computer. Maybe a week later the files are copied again, overwriting the original backup. 10 minutes later you realise you deleted something really important before you did the second backup. Disaster! 

Fortunately all modern backup solutions can be configured to only backup files which have changed since the previous backup, retaining deleted files until they are older than a specified age. 

How many copies of the backups do you need? What are the chances that the backup will fail just when you need it most? I'm pretty paranoid so even for for my home backups I have at least two copies in different locations and the machine hosting my primary backup uses RAID 1 to duplicate the data onto two disks.

# Devising a sane backup strategy

Rsnapshot does some clever hard-linking to give you the appearance of many independent backups without having to store many copies of the same files. In the example below the same directory has been backed-up two days in a row (daily.0 is the most recent). Even though file1.txt has been deleted at some point and is missing from the latest backup, an older version is still in the system. If file2.exe and file3.xml haven't changed they will only be stored on disk once.


    backup_root
    |- daily.0
    |  |-directory1
    |    |-file2.exe
    |    |-file3.xml
    |
    |- daily.1
       |-directory1
         |-file1.txt
         |-file2.exe
         |-file3.xml

Disk space is pretty inexpensive these days so it's feasible for most small-scale scenarios to retain quite a long history. An example of a reasonable strategy is:

* Take a backup of some files every hour.
* Retain hourly backups for the previous 24 hours.
* Retain one backup from each day of the past week.
* Retain one backup from each week of the past month.
* Retain one backup from each month for the past 5 years.

This has raised some eyebrows. Why instigate a strategy for backing up five year's worth of data? Why retain so many backups for the latest day? It seems like overkill. But a better question is why not? If your business is still going in 5 years and has grown to 100x its original size then shelling out for a couple of disks is the least of your worries. If you do run out of space older backups can be removed, but why do it prematurely? 

The space requirements for the above strategy can be calculated pretty easily. Let's say that we start with a 100Gb website, and every day users upload 1Gb of new videos. 

| **Data** &nbsp;&nbsp;| **Size** |
|-|-|
| Initial data size						 	| 100Gb 
| Daily change (additions or modifications) | 1Gb   
|&nbsp;|

In two years the total size of the data will be no more than 2Tb. In reality some content will be removed so the final value is likely to be lower. To calculate the backup space required.

| **Backups** &nbsp;&nbsp;	| **Number retained** &nbsp;&nbsp;	| **Size per increment** &nbsp;&nbsp;| **Total** 
|-----------|-------------------|--------------------|-------
| Hourly 	| 24   				| 42Mb               | 1Gb   
| Daily  	| 7    				| 1Gb                | 7Gb   
| Weekly 	| 4    				| 7Gb                | 28Gb  
| Montly 	| 60   				| 31Gb               | 1.86Tb
|&nbsp;|||

So the maximum space requirement for the above would be 2 terabytes. That means a total spend of < £250 for a couple of 3Tb disks to run in RAID 1 (another copy is always good!), and most use cases will have more modest requirements.

# Security considerations  

The backup will most likely contain a lot of sensitive information, so it's worth taking some time to consider the implications of your backup particularly for:

* **Data at rest** How is the backup media protected? Is it in a secure data centre? If it's on a USB hard drive at home, how secure is it? What are the costs of losing the disk, and what is the chance of it being lost?
* **Data in transit** What protocols are used to transmit the backup information between servers? Are the username and password credentials transmitted in a way which could be recovered by an attacker?

Encryption helps mitigate the risks for both scenarios (although you then need to think about how to protect your encryption keys or passphrases).

## Encryption of data at rest

Here you have a couple of options: encrypt the data before transmitting it or encrypt it once it's been received.

There are a plethora of drive encryption tools out there, and I have worked with and can recommend [Truecrypt](http://www.truecrypt.org/) for both Linux and Windows platforms. Ubuntu natively supports [dm\_crypt and LUKS](https://help.ubuntu.com/community/EncryptedFilesystemsOnRemovableStorage) which makes the setup and management a little easier. If the entire drive is encrypted you'll need to enter a passphrase or use a key to mount the device each time it's connected (hint: a [YubiKey](http://www.yubico.com/products/yubikey-hardware/yubikey/) can solve this issue elegantly) but if the drive is lost or stolen there's almost no way for the data to be recovered by an attacker, assuming a reasonable encryption algorithm has been used. A word of warning though. The same is true if you forget the passphrase or lose the key.

Another option is to encrypt the archive files rather than the entire disk using [GPG](http://askubuntu.com/questions/95920/encrypt-tar-gz-file-on-create).

## Encryption of data in transit

If you have encrypted the data before transmitting it then half the problem is already solved, however it is easy to overlook the username and password used to make the connection. 

If you have access to a shared hosting instance using FTP (which is unencrypted), check if the provider offers FTPS (FTP over SSL). Similarly anyone using telnet should look for SSH. Any good hosting service will provide secure access, and it is a good idea to disable their insecure counterparts.

# Test, test and test again!

This is by far the most overlooked aspect of any backup plan. Many people get their backups in a nice encrypted TAR or database dump, sit back and think the task is over, but what use is a backup if it doesn't get you back up and running? It's all too easy to omit a critical configuration file, or accidentally dump the data for your database but not the schema, so testing is critical. 

The simplest way to test a website backup is to use a fresh machine and build the database and files from the backup and check that the site loads and doesn't throw errors. 

Be sure to test often though. It's easy for errors to creep in, or files to be added to the server without being added to the backup scheme. The subject of regression testing backups and automating the backup verfication process is defintely out of the scope of this post!

In the next post I'll detail how to set up a simple Rsnapshot server to back up one or more remote sites over FTPS.