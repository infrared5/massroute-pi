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
    switchModule = require(process.cwd() + '/script/switch-module'),
    directionModule = require(process.cwd() + '/script/direction-module'),
    driver = Object.create(Object.prototype, {
      "switch": {
        value: switchModule,
        writable: false,
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

function handleStopPrediction(stopId, err, response) {
  if(err) {
    logger.error('Error in stop prediction for ' + stopId + ' : ' + err);
  }
}

driver.start = function() {
  logger.info('starting driver...');
  proxy.use(handleStopPrediction);
  proxy.start(this.inbound.stops.concat(this.outbound.stops));
};

driver.stop = function() {
  logger.info('stopping driver...');
  proxy.stop();
};

module.exports = {
  getDriver: function(service, switchConfiguration, inboundConfiguration, outboundConfiguration) {
    proxy = service;

    driver.inbound = directionModule.create(inboundConfiguration);
    driver.outbound = directionModule.create(outboundConfiguration);

    driver.switch.configure(switchConfiguration.pin);
    driver.switch.on('on', driver.start.bind(driver));
    driver.switch.on('off', driver.stop.bind(driver));
    
    return driver;
  }
};
