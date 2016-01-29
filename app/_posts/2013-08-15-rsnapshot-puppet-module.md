---
layout: post
tags: ['post','technology','backup','rsnapshot','automation','puppet','linux']
title: "Rsnapshot Puppet module"
date: 2013-08-15 19:20
comments: true
---

<blockquote>
People want to be seen as being clever, so the result is people wind up working in a cave.
<small>Brian Fitzpatrick, Ben Collins-Sussman <cite>http://www.youtube.com/watch?v=0SARbwvhupQ</cite></small>
</blockquote>

I'm often a perfectionist, and after watching [this excellent talk at Google I/O 2009](http://www.youtube.com/watch?v=0SARbwvhupQ) have realised I'm definitely guilty of keeping things under wraps until they're 'ready' (read 'dead and forgotten'). Here's my attempt to rectify that.

Over the past couple of weeks I've been building a full-fledged [Rsnapshot](http://www.rsnapshot.org/) module for the [Puppet configuration management platform](http://projects.puppetlabs.com/). What started as a simple puppet-isation of an install turned into a labour of love to build my first publishable Puppet module.

The module can be found here: https://github.com/spikeheap/puppet_rsnapshot and is released under the [GPL v3](http://www.gnu.org/licenses/gpl.html). Pull requests and issues are welcome! 
<!-- more -->
The module solves a simple problem: configure a central Rsnapshot system with node-specific backup directories. The module is completely hiera-compatible.

Declaring an Rsnapshot server is as simple as:

``` ruby
node{'backup.example.com':
  rsnapshot{'backup':
    sync_first      => true
		ssh_private_key => YOURSSHKEY
  }
}
```

Then declare a client as follows:

``` ruby
node{'cleverthing.example.com':
  rsnapshot::client{'cleverthing':
    dirs => [
		  '/usr/local/myamazingapp/',
		  '/var/'
		]
  }
}
```

It's even simpler if you're using Hiera, where you'd declare the server as follows:

``` yaml
---
classes:
  - rsnapshot

rsnapshot::ssh_private_key: |
  -----BEGIN RSA PRIVATE KEY-----
  ...
  -----END RSA PRIVATE KEY-----

# All the following variables are optional, and are just to illustrate configuration 
rsnapshot::sync_first: true
rsnapshot::interval_hourly: 24
rsnapshot::cron_sync_hour: '*'
rsnapshot::cron_sync_minute: 0
rsnapshot::cron_hourly_hour: '*'
rsnapshot::cron_hourly_minute: 30
rsnapshot::cron_daily_hour: 23
rsnapshot::cron_daily_minute: 0
rsnapshot::cron_weekly_hour: 22
rsnapshot::cron_weekly_minute: 0
rsnapshot::cron_monthly_hour: 21
rsnapshot::cron_monthly_minute: 0
rsnapshot::snapshot_root: /backups/rsnapshot/
```

and the client:

``` yaml
---
classes:
- rsnapshot::client

rsnapshot::client::dirs: [
'/usr/local/myamazingapp/',
'/var/'
]
```

The module has support for all the configuration options of Rsnapshot, and I'll update the documentation shortly to explain the additional parameters.

### Limitations

Currently the module doesn't have any tests, so use it at your peril and test it on a staging environment first. This has also been developed entirely on an Ubuntu platform so your mileage may vary on other systems, though there's no reason it won't work with the right paths passed to it.

I haven't published the module to the [Puppet Forge](https://forge.puppetlabs.com/) yet because I want to complete a suite of tests, check it with puppet-lint and get the documentation up to scratch first.

In addition, the following features aren't yet complete:

* Read-only NFS mount of the backup for recovery
* Node-defined exclusions (I'm not sure if this is possible with Rsnapshot)
* Read-only rsync server accessed over SSH. A best-practice setup using restricted SSH access to a read-only rsync daemon to reduce the possibilty of attack through the backup system.
* Report collection 
* Per-host pre-backup scripts
* Space checking prior to backup

This is my first foray into Puppet modules, so feedback and (gentle) criticism is invited so I can learn. That link again is https://github.com/spikeheap/puppet_rsnapshot .
