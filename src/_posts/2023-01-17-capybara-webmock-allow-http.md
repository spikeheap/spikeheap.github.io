---
title: "Capybara, WebMock, and too many open files"
description: >-
  Working around
tags: 
  - rant
  - update
---

Getting set up with a new codebase is always a fun, sometimes head-scratching experience where you have to discern whether the issues you're facing are because you missed some piece of documentation (or it was missing), or have some bug in your setup.

I had this recently, joining a team where I just couldn't get our RSpec feature tests to run on a fresh machine and checkout. Many tests failed with "Too many open files":

```
Failure/Error: initialize_tcp host, port, local_host, local_port

          Errno::EMFILE:
            Failed to open TCP connection to 127.0.0.1:9526 (Too many open files - socket(2) for 127.0.0.1 port 9526)
```

This led me to [a gotcha in Capybara/WebMock](https://github.com/teamcapybara/capybara#gotchas) that was causing the error. I still have no idea why this affected my Ruby build on MacOS Ventura, but none of my colleagues 🤷‍♂️. 

The error occurs because `Net::HTTP` has separate `connect` and `request` phases, but WebMock was designed with `connect` being part of the `request` step. Because there's no information about the request in the `connect` step (just the destination address), WebMock can't decide whether to stub or pass through the connection at that point, so they made the design decision to delay `connect` until a request is made. This is the approach of many HTTP libraries, but not `Net::HTTP`.

Fixing the error appeared to be as simple as [setting `net_http_connect_on_start: true`](https://github.com/bblimke/webmock/blob/master/README.md#connecting-on-nethttpstart) to undo WebMock's workaround for `Net::HTTP`, however this introduced a new SSL certificate error for a mocked request. This was curious, because the requests are supposed to be mocked, so we don't expect any external connection to be made.

It turns out that setting `net_http_connect_on_start: true`  works around the Capybara gotcha by enabling all `Net::HTTP` connections to be made[^1], while still intercepting and mocking the `request`s appropriately. We happened to see an error because of an SSL certificate problem on a host we didn't really want to connect to.

## Scoping eager connections
Thankfully, `net_http_connect_on_start` is smarter than just accepting `true` or `false`. There are a [bunch of tests showing](https://github.com/bblimke/webmock/blob/833291d4ce2d5927a738f929db26b594bf4fa7f5/spec/unit/webmock_spec.rb#L61) `net_http_connect_on_start` accepts:
- Regular expression matching host
- Host
- Port
- Scheme (e.g. `http`, `https`)

For our test suite, we disallow all connections _except_ the Capybara server, so the working solution for us was to scope `net_http_connect_on_start` to match the allowed host:

```ruby
WebMock.disallow_net_connect!(
    allow_localhost: true, 
    allow: Capybara.server_host, 
    net_http_connect_on_start: Capybara.server_host
  )
```

For another gotcha: WebMock supports passing a list of hosts to `allow`, but this isn't supported by `net_http_connect_on_start`, where you'll need a regular expression instead if you have multiple disparate hosts.

---

[^1]: Mostly thanks to [this comment](https://github.com/bblimke/webmock/issues/914#issuecomment-810134233)