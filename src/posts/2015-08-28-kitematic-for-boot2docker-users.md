---
layout: post
tags: ['post', 'docker']
title: Kitematic for boot2docker users
comments: true
date: 2015-08-28
---

A while ago I switched from using boot2docker directly to the Kitematic Mac app. Although Kitematic generally makes life a bit easier when managing Docker containers, it was a bit of a pain to get it running.

After the Kitematic installation, the VM started but Kitematic had trouble connecting to it. The error messages showed `boot2docker` paths so I made the assumption they'd got in a tangle. Uninstalling boot2docker didn't entirely solve the problem, as I was still unable to connect using the terminal. The error pointed us in the right direction:

```
FATA[0000] Couldn't read ca cert /Users/rb/.boot2docker/certs/boot2docker-vm/ca.pem: open /Users/rb/.boot2docker/certs/boot2docker-vm/ca.pem: no such file or directory
```

The other error I was hitting was a bit more vague, but still points to a certificate issue.

```
Get http://192.168.99.102:2376/v1.17/containers/json: malformed HTTP response "\x15\x03\x01\x00\x02\x02". Are you trying to connect to a TLS-enabled daemon without TLS?
```

You may find it's because the boot2docker environment variables are being set in your `.profile`, `.bashrc` or `.zshenv`, something like:

```
export DOCKER_TLS_VERIFY=1
export DOCKER_HOST=tcp://192.168.59.103:2376
export DOCKER_CERT_PATH=/Users/rb/.boot2docker/certs/boot2docker-vm
```

To get the docker CLI playing nicely with our shiny new Kitematic instance, we just need to replace those lines with the following:
```bash
export DOCKER_TLS_VERIFY=1
export DOCKER_HOST=tcp://192.168.60.102:2376
export DOCKER_CERT_PATH=~/.docker/machine/machines/dev
```

Note that if (like me) you've already removed/reinstalled Kitematic, you may find the IP (and possibly subnet) has moved from `192.168.60.103`. In my case it is now `192.168.99.102`.
