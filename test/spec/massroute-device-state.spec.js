/*global describe:false it:false expect:false process:false*/
var driverFactory = require(process.cwd() + '/script/massroute-driver'),
    proxyFactory = require(process.cwd() + '/script/massroute-proxy'),
    gpio = require('gpio'),
    gpioHelper = require(process.cwd() + '/test/spec/helpers/gpio.helper');

describe('Device State', function() {
  
  var endpoint = 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}',
      switchConfig = {
        pin: '4'
      },
      inboundConfig = {
        '1128': {
          redPin: '1',
          greenPin: '2'
        },
      },
      outboundConfig = {
        '1129': {
          redPin: '3',
          greenPin: '4'
        }
      },
      proxy = proxyFactory.getProxy(endpoint),
      driver;

   beforeEach(function(done) {
    gpioHelper.stub(4, done);
    driver = driverFactory.getDriver(proxy, switchConfig, inboundConfig, outboundConfig);
  });

  afterEach(function() {
    driver = undefined;
  });

  describe('On', function() {

    it('should start requests upon notification from switch module', function(done) {
      spyOn(proxy, 'start').andCallFake(function() {
        // if we got here asynchronously, we are as expected.
        expect(true).toEqual(true);
        // TODO: move this to another expectation of proxy?
        // should be invoked with list of stops.
        expect(proxy.start).toHaveBeenCalledWith(jasmine.any(Array));
        done();
      });
      driver.switch.emit('on');
    });

  });

  describe('Off', function() {

    it('should stop requests upon notification from switch module', function(done) {
      spyOn(proxy, 'stop').andCallFake(function() {
        // if we got here asynchronously, we are as expected.
        expect(true).toEqual(true);
        done();
      });
      driver.switch.emit('off');
    });

  });

});