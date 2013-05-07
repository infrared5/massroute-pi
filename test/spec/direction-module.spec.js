var directionModule = require(process.cwd() + '/script/direction-module'),
    directionHelper = require(process.cwd() + '/test/spec/helpers/direction-module.helper');

describe('direction-module', function() {
  
  var direction;

  beforeEach(function() {
    direction = directionModule.create(directionHelper.inbound);
  });

  afterEach(function() {
    direction = null;
  });

  describe('.stops', function() {
    it('should provide list of stops from configuration', function() {
      expect(direction.stops).toEqual(['1128', '1129', '1938']);
    });
  });

  describe('.leds', function() {
    it('should generate and expose LED modules in relation to configuration', function() {
      var led,
          ledLength = 0;
      for(led in direction.leds) {
        ledLength += 1;
      }
      expect(ledLength).toEqual(3);
    });
  });

});