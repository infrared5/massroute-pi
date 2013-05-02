/*global module:false require:false setTimeout:false clearTimeout:false*/
var request = require('superagent'),
    responseDelegates = [],
    requestTimeout = 0,
    throttle = function(delay, method, scope) {
      clearTimeout(requestTimeout);
      requestTimeout = setTimeout(function() {
        clearTimeout(requestTimeout);
        method.call(scope);
      }, delay);
    },
    proxy = {
      start: function(stops) {
        if(!this.enabled) {
          this.enabled = true;
          this.stops = stops || this.stops;
          this.requestNext();
        }
      },
      stop: function() {
        if(this.enabled) {
          this.enabled = false;
          this.stops.length = 0;
        }
      },
      use: function(responseDelegate) {
        if(responseDelegates.indexOf(responseDelegate) === -1) {
          responseDelegates.push(responseDelegate);
        }
      },
      requestNext: function() {
        if(this.stops.length > 0) {
          var stopId = this.stops.shift(),
              url = this.endpoint.replace('{0}', stopId);

          (function(proxy) {
            request.get(url)
                  .set('Accept', 'application/json')
                  .end(function(err, res) {
                    var i, length = responseDelegates.length,
                        responseDelegate;
                        
                    proxy.stops.push(stopId);
                    for(i = 0; i < length; i++) {
                      responseDelegate = responseDelegates[i];
                      responseDelegate.call(proxy, err || res.error, res);
                    }
                    throttle(proxy.requestDelay, proxy.requestNext, proxy);
                  });
          }(this));
        }
      }
    };

module.exports = {
  getProxy: function(endpoint, requestDelay) {
    var p = Object.create(proxy, {
      'endpoint': {
        value: endpoint,
        writable: true,
        enumerable: true
      },
      'requestDelay': {
        value: requestDelay || 10000, // 10 seconds as per MassDOT requirements.
        writable: true,
        enumerable: true
      },
      'stops': {
        value: [],
        writable: true,
        enumerable: false
      },
      'enabled': {
        value: false,
        writable: true,
        enumerable: true
      }
    });
    return p;
  }
};