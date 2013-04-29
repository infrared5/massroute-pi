/*global module:false require:false process:false*/
var events = require('events'),
    switchModule = require(process.cwd() + '/script/switch-module'),
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

driver.shutdown = function() {
  this.stop();
  this.switch.removeListener('on', this.start);
  this.switch.removeListener('off', this.stop);
  this.switch.dispose();
};

module.exports = {
  getDriver: function(service) {
    proxy = service;

    driver.switch.configure(4);
    driver.switch.on('on', driver.start);
    driver.switch.on('off', driver.stop);
    return driver;
  }
};