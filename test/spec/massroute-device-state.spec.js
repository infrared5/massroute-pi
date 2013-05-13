/*global describe:false it:false expect:false process:false require:false beforeEach:false afterEach:false spyOn:false jasmine:false*/
var driverFactory = require(process.cwd() + '/script/massroute-driver'),
    proxyFactory = require(process.cwd() + '/script/massroute-proxy'),
    gpio = require('gpio'),
    switchModule = require(process.cwd() + '/script/switch-module'),
    gpioHelper = require(process.cwd() + '/test/spec/helpers/gpio.helper'),
    directionHelper = require(process.cwd() + '/test/spec/helpers/direction-module.helper');

describe('Device State', function() {
  
  var endpoint = 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}',
      switchConfig = {
        pin: 4
      },
      proxy = proxyFactory.getProxy(endpoint),
      driver;

   beforeEach(function(done) {
    gpioHelper.stub(switchConfig.pin, done);
    driver = driverFactory.getDriver(proxy, switchModule.create(switchConfig), directionHelper.inboundModule, directionHelper.outboundModule);
  });

  afterEach(function() {
    driver = undefined;
  });

  describe('On', function() {

    it('should start requests upon notification from switch module', function(done) {
      console.log('on start()');
      spyOn(proxy, 'start').andCallFake(function() {
        // if we got here asynchronously, we are as expected.
        expect(true).toEqual(true);
        // TODO: move this to another expectation of proxy?
        // should be invoked with list of stops.
        expect(proxy.start).toHaveBeenCalledWith(jasmine.any(Array));
        done();
      });
      console.log('is switch: ' + (driver.switch === switchModule) );
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