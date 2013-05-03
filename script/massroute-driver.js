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
    inboundModule = {
      stops: ['1128', '1129', '1938']
    },
    outboundModule = {
      stops: ['11164', '1164', '1162']
    },
    driver = Object.create(Object.prototype, {
      "switch": {
        value: switchModule,
        writable: false,
        enumerable: true
      },
      "inbound": {
        value: inboundModule,
        writable: true,
        enumerable: true
      },
      "outbound": {
        value: outboundModule,
        writable: true,
        enumerable: true
      }
    }),
    proxy;

function handleStopPrediction(err, response) {
  if(err) {
    logger.error('Error in stop prediction: ' + err);
  }
}

driver.start = function() {
  logger.info('starting driver...');
  proxy.use(handleStopPrediction);
  proxy.start(inboundModule.stops.concat(outboundModule.stops));
};

driver.stop = function() {
  logger.info('stopping driver...');
  proxy.stop();
};

module.exports = {
  getDriver: function(service) {
    proxy = service;

    driver.switch.configure(4);
    driver.switch.on('on', driver.start);
    driver.switch.on('off', driver.stop);
    return driver;
  }
};
