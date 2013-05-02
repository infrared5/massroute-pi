/*global require:false spyOn:false setTimeout:false clearTimeout:false module:false*/
var gpio = require('gpio'),
    events = require('events');

var gpioStub = function(pin, done) {
  var gpioMock = Object.create(events.EventEmitter.prototype);
  gpioMock.unexport = function() {
    // swallow.
  };
  gpioMock._get = function() {
    // swallow.
  };
  spyOn(gpio, 'export')
    .andCallFake(function(pin, config) {
      var readyTimeout;
      readyTimeout = setTimeout(function() {
        clearTimeout(readyTimeout);
        config.ready.call(null);
        done();
      }, 500);
      return gpioMock;
    });
  return gpioMock;
};

module.exports.stub = gpioStub;