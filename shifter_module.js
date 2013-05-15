/*global require:false process:false setInterval:false*/
var shifterModule = require(process.cwd() + '/script/shifter'),
    shiftConfig = {
      amount: 1,
      dataPin: 17,
      latchPin: 21,
      clockPin: 18
    },
    logger = require(process.cwd() + '/script/massroute-logger'),
    shifter,
    flag = 0;

shifter = shifterModule.create(shiftConfig);
shifter.start(function() {
  setInterval(function() {
    if(flag++ % 2) {
      logger.info('set red');
      shifter.setPin(0, 1);
      shifter.setPin(1, 0);
      shifter.write();
    }
    else {
      logger.info('set green');
      shifter.setPin(0, 0);
      shifter.setPin(1, 1);
      shifter.write();
    }
  }, 1000);
});