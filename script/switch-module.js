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
    ready: (function(switchModule) {
      return function() {
        switchModule.module.on('change', function(value) {
          switchModule.emit((value) ? 'on' : 'off');
        });
      };
    }(this))
  });
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