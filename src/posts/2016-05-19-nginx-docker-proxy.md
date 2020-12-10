---
layout: post
tags: ['post', 'software', 'development', 'programming', 'docker', 'nginx', 'rails']
title: "A simple HTTPS proxy with Nginx on Docker"
description: "Add a lightweight nginx container to your Docker setup to test HTTPS-related things."
comments: true
date: 2016-05-19 17:12:25+00:00
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

At this point, we're not too concerned about production performance, and want to retain development conveniences such as live-reloading, so we can just proxy requests directly to our app, in this case a Rails server fired up using `rails s`.

### The setup

You may already have an nginx config which works for you in production, but if not, here's a simple setup which proxies all requests to an upstream server/container named 'rails', and redirects all HTTP traffic to HTTPS:

```conf
user nobody nogroup;

pid /tmp/nginx.pid;

error_log stderr;
# error_log /var/log/nginx/error.log;

events {
  worker_connections 1024; # increase if you have lots of clients
  accept_mutex off; # "on" if nginx worker_processes > 1
  # use epoll; # enable for Linux 2.6+
  # use kqueue; # enable for FreeBSD, OSX
}

http {
  include mime.types;
  default_type application/octet-stream;
  # access_log /var/log/nginx/access.log combined;
  access_log /dev/stdout;
  sendfile on;
  tcp_nopush on; # off may be better for *some* Comet/long-poll stuff
  tcp_nodelay off; # on may be better for some Comet/long-poll stuff
  gzip on;
  gzip_http_version 1.0;
  gzip_proxied any;
  gzip_min_length 500;
  gzip_disable "MSIE [1-6]\.";

  # So Rails can be aware of whether it's HTTP/HTTPS
  proxy_set_header X-Forwarded-Proto $scheme;

  upstream app_server {
    server rails:3000 fail_timeout=0;
  }

  # global certs per ip but a cert can sign *.mysite.dev mysite.dev
  ssl_certificate      /usr/local/app/certs/server.crt;
  ssl_certificate_key  /usr/local/app/certs/server.key;

  server {
    listen         80;
    server_name    192.168.99.100;
    return         301 https://$server_name$request_uri;
  }

  server {
    listen       443 ssl;
    server_name 192.168.99.100;
    ssl           on;
    client_max_body_size 4G;
    keepalive_timeout 5;
    root /usr/src/app/;
    try_files $uri/index.html $uri.html $uri @app;

    location @app {
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_pass http://app_server;
    }

    # Rails error pages
    error_page 500 502 503 504 /500.html;
    location = /500.html {
      root /usr/src/app/public;
    }
  }
}
```

The [official nginx docker images](TODO) don't currently support HTTPS, so we'll need to build an image to serve as our proxy:

```Dockerfile
FROM alpine:3.2
MAINTAINER ryan@slatehorse.com

RUN apk add --update nginx openssl && rm -rf /var/cache/apk/*

COPY ./nginx.conf /etc/nginx/nginx.conf

# Generate certificates
ENV CERTIFICATE_DIR=/usr/local/app/certs

# The hostname used in the certificate. For OSX/Windows you can use the VM IP.
# For Linux, localhost works fine. 
ENV DOCKER_HOSTNAME=192.168.99.100

RUN mkdir -p /usr/local/app/certs

RUN openssl req -new -x509 -nodes -subj "/CN=${DOCKER_HOSTNAME}/O=Your Company Name/C=UK" -keyout $CERTIFICATE_DIR/server.key -out $CERTIFICATE_DIR/server.crt

VOLUME /var/log/nginx/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

This isn't really doing anything interesting other than the following:

```bash
RUN openssl req -new -x509 -nodes -subj "/CN=${DOCKER_HOSTNAME}/O=Your Company Name/C=UK" -keyout $CERTIFICATE_DIR/server.key -out $CERTIFICATE_DIR/server.crt
```

This generates a self-signed certificate and drops it into the path we've used in `nginx.conf`.

With that, you're ready to go, in development at least. To integrate this into an existing docker-compose setup you could drop the above files in `./docker/nginx/` and add the following to your `docker-compose.yml`:

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



