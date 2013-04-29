/*global module:false*/
var events = require('events'),
    switchModule = new events.EventEmitter(),
    inboundModule = {
      stops: ['1128', '1129', '1938']
    },
    outboundModule = {
      stops: ['11164', '1164', '1162']
    },
    driver = Object.create(Object.prototype, {
      "switch": {
        value: switchModule,
        writable: false,
        enumerable: true
      },
      "inbound": {
        value: inboundModule,
        writable: true,
        enumerable: true
      },
      "outbound": {
        value: outboundModule,
        writable: true,
        enumerable: true
      }
    }),
    proxy;

driver.start = function() {
  proxy.start(inboundModule.stops.concat(outboundModule.stops));
};

driver.stop = function() {
  proxy.stop();
};

module.exports = {
  getDriver: function(service) {
    proxy = service;
    driver.switch.on('on', function() {
      driver.start();
    });
    driver.switch.on('off', function() {
      driver.stop();
    });
    return driver;
  }
};