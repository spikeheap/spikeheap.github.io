---
title: "Docker context switching"
description: >-
  When you regularly connect to different Docker daemons, Docker contexts are handy.
tags: 
  - docker
---
Sometimes it's useful to run multiple Docker contexts/daemons, e.g. if you're running Docker Desktop and [Lima](https://github.com/lima-vm/lima), or local Kubernetes clusters.

Switching to Lima was straightforward, but I found myself scratching around trying to find how to get back to the Docker Desktop config.

For when I forget next time:

```bash
# list the contexts so you pick the right one
docker context ls

# switch to Lima
docker context use lima 

# switch back to Docker Desktop
docker context use default 
```