/*global require:false process:false describe:false it:false beforeEach:false afterEach:false spyOn:false expect:false*/
var proxyFactory = require(process.cwd() + '/script/massroute-proxy'),
    request = require('superagent');

describe('Bus Stop Prediction Request', function() {
  
  var proxy,
      endpoint = 'http://68.169.43.76/bus/{0}',
      delay = 500, // 10 seconds
      stopIds = ['1128', '1129', '1938'],
      responseDelegate;

  beforeEach(function() {
    proxy = proxyFactory.getProxy(endpoint, delay);
    spyOn(request, 'get').andCallFake(function() {
      var response = {
        set: function(header) {
          // swallow.
          return this;
        },
        end: function(delegate) {
          var timeout;
          responseDelegate = delegate;
          timeout = setTimeout(function() {
            clearTimeout(timeout);
            delegate.call(null, null, {ok:true});
          }, 200);
          return this;
        }
      };
      return response;
    });
  });

  afterEach(function() {
    proxy.stop();
  });

  it('should request next item with defined stopId on massroute-proxy:start()', function() {
    var stop = stopIds[0];
    proxy.start(stopIds.splice(0));
    expect(request.get).toHaveBeenCalledWith(endpoint.replace('{0}', stop));
  });

  it('should append requested stopId to end after request response', function(done) {
    var stop = stopIds[0];
    proxy.use(function(err, res) {
      expect(proxy.stops[proxy.stops.length-1]).toBe(stop);
      done();
    });
    proxy.start(stopIds.splice(0));
  });

  it('should not request subsequent stops until after defined request delay', function(done) {
    var callCount = 0,
        time = 0;
    proxy.use(function(err, res) {
      callCount += 1;
      if(callCount === 1) {
        time = new Date().getTime();
      }
      else if(callCount === 2) {
        // minus 1 incase of === which is in perfect conditions.
        expect((new Date().getTime()) - time).toBeGreaterThan(proxy.requestDelay-1);  
        done();
      }
    });
    proxy.start(stopIds.splice(0));
  });

});