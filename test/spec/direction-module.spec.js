var directionModule = require(process.cwd() + '/script/direction-module');

describe('direction-module', function() {
  
  var inboundConfig = {
        '1128': {
          redPin: '1',
          greenPin: '2'
        }, 
        '1129': {
          redPin: '3',
          greenPin: '4'
        },
        '1938': {
          redPin: '5',
          greenPin: '6'
        }
      },
      direction;

  beforeEach(function() {
    direction = directionModule.create(inboundConfig);
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