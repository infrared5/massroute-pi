var proxyFactory = require(process.cwd() + '/script/massroute-proxy');

describe('Bus Stop Prediction Request', function() {
	
	var proxy,
		endpoint = 'http://68.169.43.76/bus/{0}',
		stopIds = ['1128', '1129', '1938'];

	beforeEach(function() {
		proxy = proxyFactory.getProxy(endpoint);
		proxy.start(stops);
	});

	afterEach(function() {
		proxy.stop();
	});

});