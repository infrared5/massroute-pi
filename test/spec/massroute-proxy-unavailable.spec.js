/*global describe:false process:false beforeEach:false afterEach:false it:false require:false*/
var nock = require('nock'),
    directionHelper = require(process.cwd() + '/test/spec/helpers/direction-module.helper'),
    driverFactory = require(process.cwd() + '/script/massroute-driver'),
    proxyFactory = require(process.cwd() + '/script/massroute-proxy');

describe('MassRoute-Proxy service unavailable', function() {
  
  var endpoint = 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}',
      shiftConfig = {
        amount: 1,
        dataPin: 17,
        latchPin: 21,
        clockPin: 18
      },
      switchConfig = {
        pin: 4
      },
      proxy = proxyFactory.getProxy(endpoint),
      driver = driverFactory.getDriver(proxy, shiftConfig, switchConfig, directionHelper.inbound, directionHelper.outbound),
      mockProxy = nock('http://68.169.43.76:3001')
                  .get('/routes/39/destinations/39_1_var1/stops/1128')
                  .reply(404);

  it('should report service unavailable on unsuccessful response on service', function(done) {
    proxy.use(function(stopId, error, result) {
      if(error) {
        // if we got here asynchronously, we are as expected.
        expect(true).toEqual(true);
        done();
      }
      // explicitly stop driver, regardless.
      driver.stop();
    });
    // start driver directly.
    driver.start();
  });

});