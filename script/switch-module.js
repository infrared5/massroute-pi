/*global module:false require:false*/
var events = require('events'),
    gpio = require('gpio'),
    winston = require('winston'),
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          prettyPrint: true,
          colorize: true,
          timestamp: true
        })
      ]
    }),
    switchModule = {
      configure: function(pin) {
        if(this.module) {
          this.dispose();
        }
        this.module = gpio.export(pin, {
          direction: 'in',
          ready: (function(sm) {
            return function() {
              var moduleValue = sm.module.value;
              logger.info('switch-module ready(). value: ' + moduleValue);
              // access current value - 0 by default.
              sm.module._get(function(value) {
                if(moduleValue !== value) {
                  logger.info('switch-module _get() value change to: ' + value);
                  sm.module.value = value;
                  sm.emit(value ? 'on' : 'off');
                }
              });
              sm.module.on('change', function(value) {
                logger.info('switch-module \'change\': ' + value);
                sm.module.value = value;
                sm.emit(value ? 'on' : 'off');
              });
            };
          }(this))
        });
        return this.module;
      },
      dispose: function() {
        if(this.module) {
          try {
            this.module.removeAllListeners('change');
            this.module.reset();
            this.module.unexport();
            this.module = null;
          }
          catch(e) {
            logger.error('[ERROR] switchModule:dispose() :: ' + e.message);
          }
        }
      },
      on: function(type, delegate) {
        this.emitter.on(type, delegate);
      },
      emit: function(type) {
        this.emitter.emit(type);
      }
    };

module.exports = {
  create: function(configuration) {
    var s = Object.create(switchModule, {
      'value': {
        value: 0,
        writable: true,
        enumerable: true
      },
      'module': {
        value: undefined,
        writable: true,
        enumerable: true
      },
      'emitter': {
        value: new events.EventEmitter(),
        writable: false,
        enumerable: true
      }
    });
    s.configure(configuration.pin);
    return s;
  }
};
