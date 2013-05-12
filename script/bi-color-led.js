/*global module:false require:false process:false*/
var biColorLED = {
  red: function() {
    this.shifter.setPin(this.redPin, 1);
    this.shifter.setPin(this.greenPin, 0);
  },
  green: function() {
    this.shifter.setPin(this.redPin, 0);
    this.shifter.setPin(this.greenPin, 1);
  },
  off: function() {
    this.shifter.setPin(this.redPin, 0);
    this.shifter.setPin(this.greenPin, 0);
  } 
};

module.exports = {
  create: function(redPin, greenPin, shifter) {
    var led = Object.create(biColorLED, {
      "redPin": {
        value: redPin,
        writable: true,
        enumerable: true
      },
      "greenPin": {
        value: greenPin,
        writable: true,
        enumerable: true
      },
      "shifter": {
        value: shifter,
        writable: true,
        enumerable: true
      }
    });
    return led;
  }
};