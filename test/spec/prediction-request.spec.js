/*global require:false process:false describe:false it:false beforeEach:false afterEach:false spyOn:false expect:false*/
var proxyFactory = require(process.cwd() + '/script/massroute-proxy'),
		request = require('superagent');

describe('Bus Stop Prediction Request', function() {
	
	var proxy,
			endpoint = 'http://68.169.43.76/bus/{0}',
			stopIds = ['1128', '1129', '1938'],
			responseDelegate;

	beforeEach(function() {
		proxy = proxyFactory.getProxy(endpoint);
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

	it('should begin request on massroute-proxy:start()', function() {
		spyOn(proxy, 'start');
		proxy.start(stopIds);
		expect(proxy.start).toHaveBeenCalled();
	});

	it('should request next item with defined stopId on massroute-proxy:start()', function() {
		var stop = stopIds[0];
		proxy.start(stopIds);
		expect(request.get).toHaveBeenCalledWith(endpoint.replace('{0}', stop));
	});

	it('should append requested stopId to end after request response', function(done) {
		var stop = stopIds[0];
		proxy.use(function(err, res) {
			expect(proxy.stops[proxy.stops.length-1]).toBe(stop);
			done();
		});
		proxy.start(stopIds);
	});

});