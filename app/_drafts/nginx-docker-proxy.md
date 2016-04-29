---
layout: post
tags: ['post', 'software', 'development', 'programming', 'docker', 'nginx', 'rails']
title: "A simple HTTPS proxy with Nginx on Docker"
description: "Add a lightweight nginx container to your Docker setup to test HTTPS-related things."
comments: true
---

There are many reasons why you might need to develop behind an HTTPS proxy, for example when testing integrations which behave differently based on the security of your site. This post describes how to add an nginx proxy to your docker setup.

<!-- more -->

### TL;DR

I know, you probably don't care about the back-story, you just want the code. If that's you, this is all you need:

1. This isn't production-quality. Mirror your production environment if you can.
2. The `Dockerfile` and `nginx.conf` are in [this gist](https://gist.github.com/spikeheap/488929887d22e74783a5f4f982981a84). 
3. This assumes you've got a `rails` container linked through docker-compose. Tweak it to your needs.
4. See [1].

### Background

Not so long back I was working on a Dropbox OAuth integration. This sent the user off to Dropbox to approve and connect their account to us before redirecting back to our site to continue the process. Dropbox have rules in place to protect users from accidentally exposing their details on insecure sites and push developers to secure their work. One of these rules means that if you ask Dropbox to redirect a user back to an HTTP address it will _always_ ask them to confirm their permission. If you're using HTTPS it will just redirect back if they have already approved the connection in the past. This difference in behaviour is a sensible one, however it's another example of the development and production environments diverging, which we don't really want.

It's good practice to have all your production traffic use HTTPS, so we need a lightweight HTTPS proxy which we can stick in front of whichever app server we're developing against.

At this point, we're not too concerned about production performance, and want to retain development conveniences such as live-reloading, so we can just proxy requests directly to our app, in this case a Rail server fired up using `rails s`.

### The setup

You may already have an nginx config which works for you in production, but if not, here's a simple setup which proxies all requests to an upstream server/container named 'rails', and redirects all HTTP traffic to HTTPS:

{% gist spikeheap/488929887d22e74783a5f4f982981a84 nginx.conf %}

The [official nginx docker images](TODO) don't currently support HTTPS, so we'll need to build an image to serve as our proxy:

{% gist spikeheap/488929887d22e74783a5f4f982981a84 Dockerfile %}

This isn't really doing anything interesting other than the following:

```bash
RUN openssl req -new -x509 -nodes -subj "/CN=${DOCKER_HOSTNAME}/O=Your Company Name/C=UK" -keyout $CERTIFICATE_DIR/server.key -out $CERTIFICATE_DIR/server.crt
```

This generates a self-signed certificate and drops it into the path we've used in `nginx.conf`.

With that, you're ready to go, in development at least. To integrate this into an existing docker-compose setup you could drop the above files in `./docker/nginx/` add the following to your `docker-compose.yml`:

```yaml
nginx:
  build: docker/nginx/
  ports:
    - "80:80"
    - "443:443"
  links:
    - rails
```

Fire up a browser and check it out. The certificate is self-signed, so your browser won't trust it by default, but you trust yourself... right?

### Caching 

With the above approach you'll get a new self-signed certificate every time you rebuild the image. This can be a bit of a pain if you're rebuilding often, so if this affects you just mount a a local directory as a volume at`/usr/local/app/certs` and put your certificates there. This will persist across container changes and image builds.

### Summary

You probably wouldn't want to use the nginx configuration provided here for production, but hopefully it demonstrates how easily we can add additional services into our development environment to bridge the gap to production one step at a time.



