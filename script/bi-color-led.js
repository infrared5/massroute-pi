/*global module:false require:false process:false*/
var biColorLED = {
  red: function() {
    // redPin:HIGH
    // greenPin:LOW
  },
  green: function() {
    // redPin:LOW
    // greenPin:HIGH
  },
  off: function() {
    // redPin:LOW
    // greenPin:LOW
  } 
};

module.exports = {
  create: function(redPin, greenPin) {
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
      }
    });
    return led;
  }
};