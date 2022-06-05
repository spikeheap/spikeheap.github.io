---
tags: 
  - engineering
  - guide
title: "Managing sudoers with Puppet"
date: 2013-08-13 21:54:00
comments: true
description: Managing the sudoers file of the puppetmaster with Puppet is like playing with fire while drenched in petrol. If you must do it be really *really* careful!
---
<blockquote>
Managing the sudoers file of the puppetmaster with Puppet is like playing with fire while drenched in petrol. If you must do it be really *really* careful!
</blockquote>

Today I re-learned a valuable lesson about the power of Puppet: it can be a force for evil if you forget the little extra things you set up weeks ago. Fortunately it's easy to reproduce, so try it for yourself! If there's ever an obvious reason to keep a remote clone of your Puppet configuration, this is it.

Step one is easy. To have a good self-managing Puppet setup you really want your clients to auto-configure themselves. That configuration is going to do sane things like (for example) setting 'pluginsync' and ensuring the Puppet client daemon is running, configured to start on boot, etc. 

Step two follows a little while later. The need arises to manage a sudoers file and rather than reinvent the wheel you install the popular [*sudo* package by *saz*](https://forge.puppetlabs.com/saz/sudo).

This package got a [great review from PuppetLabs](https://puppetlabs.com/blog/module-of-the-week-sazsudo-manage-sudo-configuration/) and is easy to configure:

``` ruby
# Manage sudoers with the module
class { 'sudo': }

# Declare a sudoer with the username 'bill'
sudo::conf { 'bill':
  priority => 10,
  content  => 'bill ALL=(ALL) NOPASSWD: ALL',
}
```

The key step here is to run Puppet and see new files created in /etc/sudoers.d/, check the content and think all is well. The *facepalm* moment really happened when I failed to check the run had added the *include* into the sudoers file to make it bother to read the files in *sudoers.d*. Unfortunately for me this hadn't happened, so although the files were there I no longer had sudo privileges on the client.

No problem! Simply fixing the module to add the *include* statement would bring the client back online. Unless step three has been done.

Step three closes the loop on this suprisingly vicious circle. A few days prior to step two I was refactoring *site.pp* and decide to move the puppetmaster into the default node group so I could define it using Hiera. The migration was simple (thanks Hiera!) but in my common definition I had included the puppet client package, which caused the puppetmaster to start updating every 30 minutes like every other node.

I was a couple of minutes too late to prevent the disaster. Locking myself out of the puppetmaster was a little embarrassing, but did give me the opportunity to build the puppetmaster from scratch using Puppet. Oh how a technology can redeem itself.

##### Rebuilding the puppetmaster from scratch

Building the puppetmaster from only the /etc/puppet configuration is actually suprisingly easy. After pushing a change to the puppet repository which would prevent the problem above from being deployed to the new instance, the full steps to provision a new VM and go from zero to a full installation were:

* Provision the VM and log into it.
* [Add the newest Puppet repositories to APT](http://apt.puppetlabs.com/README.txt) (my Puppet configuration would do this later, but lets start as we mean to go on).
* Run the usual <code>apt-get install puppet git</code>
* Clone the Git repository of the Puppet configuration (the entirety of /etc/puppet).
* Use *puppet apply* on *site.pp*. I expected this to fail (and it did raise a couple of errors) but it did a significant enough job to then allow puppetmaster to start and a *puppet agent -t* to be run. <code>bash puppet apply /etc/puppet/manifests/site.pp </code>
* Make a cup of tea and bask in the reflected glory. 

##### Lessons learned 

So the lessons to be learned from this exercise are many and obvious:

1. Always keep a remote clone (or backup) of your Puppet configuration.
2. Check the puppetmaster's configuration doubly-trebly carefully, especially for the crux items like sudo where you could be locked out.
3. A fully managed Puppet node is trivial to bring up, even if that node is the puppetmaster.

Although I would rather not have been through an hour of pain learning this lesson, I now have a much stronger confidence in our configuration's resilience, so there's always a silver lining.

Now, break over, back to the Puppet Rsnapshot module...
