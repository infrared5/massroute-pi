/*global module:false require:false process:false*/
var events = require('events'),
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
    shifterModule = require(process.cwd() + '/script/shifter'),
    switchModule = require(process.cwd() + '/script/switch-module'),
    directionModule = require(process.cwd() + '/script/direction-module'),
    driver = Object.create(Object.prototype, {
      "switch": {
        value: switchModule,
        writable: false,
        enumerable: true
      },
      "shifter": {
        value: undefined,
        writable: true,
        enumerable: true
      },
      "inbound": {
        value: undefined,
        writable: true,
        enumerable: true
      },
      "outbound": {
        value: undefined,
        writable: true,
        enumerable: true
      }
    }),
    proxy;

// prediction = curl http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/1128 -X GET -H "Accept: application/json"
function handleStopPrediction(stopId, err, prediction) {
  if(err) {
    logger.error('Error in stop prediction for ' + stopId + ' : ' + err);
  }
}

driver.start = function() {
  logger.info('starting driver...');
  proxy.use(handleStopPrediction.bind(this));
  proxy.use(this.inbound.respondToPrediction.bind(this.inbound));
  proxy.use(this.outbound.respondToPrediction.bind(this.outbound));
  proxy.start(this.inbound.stops.concat(this.outbound.stops));
};

driver.stop = function() {
  logger.info('stopping driver...');
  proxy.stop();
};

module.exports = {
  getDriver: function(service, shiftConfiguration, switchConfiguration, inboundConfiguration, outboundConfiguration) {
    proxy = service;

    driver.shifter = shifterModule.create(shiftConfiguration);
    driver.inbound = directionModule.create(inboundConfiguration, driver.shifter);
    driver.outbound = directionModule.create(outboundConfiguration, driver.shifter);

    driver.switch.configure(switchConfiguration.pin);
    driver.switch.on('on', driver.start.bind(driver));
    driver.switch.on('off', driver.stop.bind(driver));
    
    return driver;
  }
};
