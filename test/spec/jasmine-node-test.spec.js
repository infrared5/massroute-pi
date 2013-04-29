/*global describe:false expect:false process:false*/
var nock = require('nock'),
    request = require('request'),
    driver = require(process.cwd() + '/script/massroute-driver'),
    proxy = require(process.cwd() + '/script/massroute-proxy'),
    mockProxy;

describe('testing grunt-jasmine-node', function() {
  beforeEach(function() {
    mockProxy = nock('http://68.169.43.76:3001')
                  .get('/routes/39/destinations/39_1_var1/stops/1129')
                  .reply(200, {predictions:[ {
                      prediction: {
                        seconds: 500
                      }
                    }
                  ]});
  });

  it('prediction time should be 500 seconds', function(done) {
    request({
      uri: 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/1129',
      json: true
    }, function(err, response, body) {
      expect(body.predictions[0].prediction.seconds).toEqual(500);
      done();
    });
  });

});