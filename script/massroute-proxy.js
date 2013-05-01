/*global module:false require:false*/
var request = require('superagent'),
    responseDelegates = [],
    proxy = Object.create(Object.prototype, {
              'endpoint': {
                value: undefined,
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

proxy.start = function(stops) {
  if(!this.enabled) {
    this.enabled = true;
    this.stops = stops || this.stops;
    this.requestNext();
  }
};

proxy.stop = function() {
  if(this.enabled) {
    this.enabled = false;
    this.stops.length = 0;
  }
};

proxy.use = function(responseDelegate) {
  if(responseDelegates.indexOf(responseDelegate) === -1) {
    responseDelegates.push(responseDelegate);
  }
};

proxy.requestNext = function() {
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
            });
    }(this));
  }
};

module.exports = {
  getProxy: function(endpoint) {
    proxy.endpoint = endpoint;
    return proxy;
  }
};