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
    driver = Object.create(Object.prototype, {
      "switch": {
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
  proxy.start(this.inbound.stops.concat(this.outbound.stops));
};

driver.stop = function() {
  logger.info('stopping driver...');
  proxy.stop();
};

module.exports = {
  getDriver: function(service, switchModule, inboundModule, outboundModule) {
    proxy = service;
    proxy.use(handleStopPrediction.bind(this));
    proxy.use(inboundModule.respondToPrediction.bind(inboundModule));
    proxy.use(outboundModule.respondToPrediction.bind(outboundModule));

    driver.switch = switchModule;
    driver.inbound = inboundModule;
    driver.outbound = outboundModule;

    driver.switch.on('on', driver.start.bind(driver));
    driver.switch.on('off', driver.stop.bind(driver));
    if(driver.switch.value === 1) {
      driver.start.call(driver);
    }
    
    return driver;
  }
};
