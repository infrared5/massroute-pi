/*global require:false process:false setInterval:false*/
var shifterModule = require(process.cwd() + '/script/shifter'),
    shiftConfig = {
      amount: 1,
      dataPin: 17,
      latchPin: 21,
      clockPin: 18
    },
    shifter,
    flag = 0;

shifter = shifterModule.create(shiftConfig);
shifter.start();

setInterval(function() {
  if(flag++ % 2) {
    shifter.setPin(1, 1);
    shifter.setPin(2, 0);
    shifter.write();
  }
  else {
    shifter.setPin(1, 0);
    shifter.setPin(2, 1);
  }
}, 1000);