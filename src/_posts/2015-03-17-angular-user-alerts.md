---
tags: ['post', 'angularjs','javascript', 'software']
title: "App-wide AngularJS alerts"
comments: true
date: 2015-03-17
description: Generic alerts are a common requirement in most web applications, and as your Angular application grows in complexity the importance of a standardised way of feeding back to the user gains importance with it. Luckily it's quite straightforward to leverage Angular services as a system-wide alerting tool.
---
Generic alerts are a common requirement in most web applications, and as your Angular application grows in complexity the importance of a standardised way of feeding back to the user gains importance with it. Luckily it's quite straightforward to leverage Angular services as a system-wide alerting tool.

There are a number of articles covering Angular user alerting, but each one relied on `$rootScope` or nested scopes. I try to avoid use of the root scope where possible, in the same way we shun the use of the global namespace in JavaScript in general. 

Th first problem we need to solve is to collect and manage the list of alerts. to do this we can create a very simple Angular service:

```js
; (function (angular) {
  'use strict';
  angular
    .module('pageAlerts')
    .factory('PageAlertsService', [ '$timeout', function($timeout) {

      // Private functions and internal state
      var internal = {

        alerts: [],

        addAlert: function(type, message, autoClose) {
          var newAlert = {
            type: type,
            message: message,
            close: function() { internal.removeAlert(this) }
          };
          internal.alerts.push( newAlert );
          if(autoClose){
            $timeout(function() { newAlert.close() }, 5000)
          }
        },

        removeAlert: function(alert) {
          internal.alerts.splice( internal.alerts.indexOf(alert), 1);
        }
      };

      // Return the public API for the service
      // We'll expose the `alerts` array for convenience
      return {
        addError: function(message, autoClose) {
          internal.addAlert('danger', message, autoClose);
        },
        addWarning: function(message, autoClose) {
          internal.addAlert('warning', message, autoClose);
        },
        addSuccess: function(message, autoClose) {
          internal.addAlert('success', message, autoClose);
        },

        alerts: internal.alerts
      };
    } ])
})(window.angular);
```

We can then create a directive to interact with the service:

```js
; (function (angular) {
  'use strict';
  angular
    .module('pageAlerts')
    .directive('pageAlerts', ['PageAlertsService', function(PageAlertsService) {
      return {
        templateUrl: '/directives/PageAlerts/PageAlerts.html',
        replace: true,
        link: function (scope) {
          scope.alerts = PageAlertsService.alerts;
        }
      }
    }]);
}(window.angular));
```

```html
<div>
  <alert ng-repeat="alert in alerts" type="{{alert.type}}" close="alert.close()">{{alert.message}}</alert>
</div>
```

The above example uses Angular Bootstrap alerts, but you can obviously roll your own within the directive.

To add the alerts to your page all you need is `<my-page-alerts></my-page-alerts>`.

The service/directive pair results in a globally accessible alerting service without the need to pollute the `$rootScope`. One criticism of this approach is that the service and directive are tightly coupled, but this can be remedied by passing in the service as an attribute to the directive, an exercise I'll leave to the reader (but grab me in the comments or [on Twitter](https://twitter.com/spikeheap) if you want a hand ;) ).
