/*global module:false require:false*/
var events = require('events'),
    gpio = require('gpio'),
    switchModule = Object.create(events.EventEmitter.prototype, {
      'module': {
        value: undefined,
        writable: true,
        enumerable: true
      }
    });

switchModule.configure = function(pin) {
  if(this.module) {
    this.dispose();
  }
  this.module = gpio.export(pin, {
    direction: 'in',
    ready: (function(sm) {
      return function() {
        var moduleValue = sm.module.value;
        // access current value - 0 by default.
        sm.module._get(function(value) {
          if(moduleValue !== value) {
            sm.emit(value ? 'on' : 'off');
          }
        });
        sm.module.on('change', function(value) {
          console.log('switch-module: change ' + value);
          sm.emit(value ? 'on' : 'off');
        });
      };
    }(this))
  });
  return this.module;
};

switchModule.dispose = function() {
  if(this.module) {
    try {
      this.module.removeAllListeners('change');
      this.module.unexport();
      this.module = null;
    }
    catch(e) {
      console.error('[ERROR] switchModule:dispose() :: ' + e.message);
    }
  }
};

module.exports = switchModule;
