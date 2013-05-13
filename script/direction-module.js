/*global module:false require:false process:false*/
var ledFactory = require(process.cwd() + '/script/bi-color-led'),
    logger = require(process.cwd() + '/script/massroute-logger'),
    directionModule = {
      respondToPrediction: function(stopId, error, prediction) {
        // todo, determine stopID LED and flip based on prediction.
      }
    };

module.exports = {
  create: function(configuration, shifter) {
    var direction = Object.create(directionModule, {
          "maximumProximity": {
            value: configuration.proximity.maximum,
            writable: false,
            enumerable: true
          },
          "minimumProximity": {
            value: configuration.proximity.minimum,
            writable: false,
            enumerable: true
          },
          "leds": {
            value: {},
            writable: false,
            enumerable: true
          },
          "stops": {
            value: [],
            writable: false,
            enumerable: true
          }
        }),
        stopIdKey, pinMap;

    for(stopIdKey in configuration.stops) {
      pinMap = configuration.stops[stopIdKey];
      direction.stops.push(stopIdKey);
      direction.leds[stopIdKey] = ledFactory.create(pinMap.redPin, pinMap.greenPin, shifter);
    }
    return direction;
  }
};