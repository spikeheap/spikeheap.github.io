---
layout: post
tags: ['post', 'angularjs','javascript', 'software']
title: "App-wide AngularJS alerts"
comments: true
---
Generic alerts are a common requirement in most web applications, and as your Angular application grows in complexity the importance of a standardised way of feeding back to the user gains importance with it. Luckily it's quite straightforward to leverage Angular services as a system-wide alerting tool.

<!--more-->

There are a number of articles covering Angular user alerting, but each one relied on `$rootScope` or nested scopes. I try to avoid use of the root scope where possible, in the same way we shun the use of the global namespace in JavaScript in general. 

Th first problem we need to solve is to collect and manage the list of alerts. to do this we can create a very simple Angular service:

{% gist spikeheap/9709d80f14bf63050d6c PageAlertsService.js %}

We can then create a directive to interact with the service:

{% gist spikeheap/9709d80f14bf63050d6c PageAlerts.js %}

{% gist spikeheap/9709d80f14bf63050d6c PageAlerts.html %}

The above example uses [Angular Bootstrap](TODO) alerts, but you can obviously roll your own within the directive.

To add the alerts to your page all you need is `<my-page-alerts></my-page-alerts>`.

The service/directive pair results in a globally accessible alerting service without the need to pollute the `$rootScope`. One criticism of this approach is that the service and directive are tightly coupled, but this can be remedied by passing in the service as an attribute to the directive, an exercise I'll leave to the reader (but grab me in the comments or [on Twitter](https://twitter.com/spikeheap) if you want a hand ;) ).
