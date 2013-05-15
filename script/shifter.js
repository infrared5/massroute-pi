/*global module:false require:false Buffer:false*/
var gpio = require('gpio'),
    logger = require(process.cwd() + '/script/massroute-logger'),
    shifter = {
      start: function() {
        this.dataOut = gpio.export(this.dataPin, {
          direction: 'out'
        });
        this.latchOut = gpio.export(this.latchPin, {
          direction: 'out'
        });
        this.clockOut = gpio.export(this.clockPin, {
          direction: 'out'
        });
        logger.info('start');
        this.clear();
      },
      stop: function() {
        try {
          if(this.dataOut) {
            this.dataOut.reset();
            this.dataOut.unexport();
          }
          if(this.latchOut) {
            this.latchOut.reset();
            this.latchOut.export();
          }
          if(this.clockOut) {
            this.clockOut.reset();
            this.clockOut.export();
          }
        }
        catch(e) {
          logger.error('shifter.out(): ' + e.message);
        }
        finally {
          this.dataOut = null;
          this.latchOut = null;
          this.clockOut = null;
        }
      },
      setPin: function(index, value) {
        var byteIndex = parseInt(index/8, 10),
            bitIndex = parseInt(index % 8, 10),
            current = this.shiftRegisters[byteIndex];
        
        current &= ~(1 << bitIndex); //clear the bit
        current |= value << bitIndex; //set the bit
        
        this.shiftRegisters[byteIndex] = current; //set the value
      },
      write: function() {
        var i = this.registerAmount,
            j = 8,
            value;
        //Set and display registers
        //Only call AFTER all values are set how you would like (slow otherwise)
        this.latchOut.set(0);
        
        //iterate through the registers
       while(--i > -1) {
          j = 8;
          //iterate through the bits in each registers
          while(--j > -1) {
            this.clockOut.set(0);
            value = this.shiftRegisters[i] & (1 << j);
            logger.info('write() : ' + value);
            this.dataOut.set(value);
            this.clockOut.set(1);
          }
        }
        this.latchOut.set(1);
      },
      clear: function() {
        var i = this.registerAmount * 8;
        logger.info('clear()');
        while(--i > -1) {
          this.setPin(i, 0);
        }
      }
    };

module.exports = {
  create: function(configuration) {
    var s = Object.create(shifter, {
      "dataPin": {
        value: configuration.dataPin,
        writable: false,
        enumerable: true
      },
      "dataOut": {
        value: undefined,
        writable: true,
        enumerable: false
      },
      "latchPin": {
        value: configuration.latchPin,
        writable: false,
        enumerable: true
      },
      "latchOut": {
        value: undefined,
        writable: true,
        enumerable: true
      },
      "clockPin": {
        value: configuration.clockPin,
        writable: false,
        enumerable: true
      },
      "clockOut": {
        value: undefined,
        writable: true,
        enumerable: true
      },
      "registerAmount": {
        value: configuration.amount,
        writable: true,
        enumerable: true
      },
      "shiftRegisters": {
        value: new Buffer(25),
        writable: true,
        enumerable: true
      }
    });
    return s;
  }
};