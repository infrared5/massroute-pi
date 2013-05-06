/*global module:false require:false process:false*/
var ledFactory = require(process.cwd() + '/script/bi-color-led'),
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
    directionModule = {
      respondToPrediction: function(stopId, error, predictionInSeconds) {
        
      }
    };

module.exports = {
  create: function(configuration) {
    var _stopList = [],
        direction = Object.create(directionModule, {
          "leds": {
            value: {},
            writable: false,
            enumerable: true
          },
          "stops": {
            value: _stopList,
            writable: true,
            enumerable: true
          }
        }),
        stopIdKey, pinMap;

    for(stopIdKey in configuration) {
      _stopList.push(stopIdKey);
      pinMap = configuration[stopIdKey];
      direction.leds[stopIdKey] = ledFactory.create(pinMap.redPin, pinMap.greenPin);
    }
    return direction;
  }
};