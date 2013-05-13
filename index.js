/*global require:false __dirname:false console:false process:false*/
var args = require('optimist').argv,
    path = require('path'),
    request = require('request'),
    connect = require('connect'),
    winston = require('winston'),
    logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          prettyPrint: true,
          colorize: true,
          timestamp: true
        })
      ]
    }),
    app = connect(),
    port = 3001,
    url = 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}',
    switchModuleFactory = require(process.cwd() + '/script/switch-module'),
    shifterModuleFactory = require(process.cwd() + '/script/shifter'),
    directionModuleFactory = require(process.cwd() + '/script/direction-module'),
    switchModule, shifterModule, inboundModule, outboundModule,
    // in, out final stops hit up first to get predictions.
    // stopIds = ['1129', '11164', '1938', '1128', '1162', '1164'];
    shiftConfig = {
      amount: 1,
      dataPin: 17,
      latchPin: 21,
      clockPin: 18
    },
    switchConfig = {
      pin: 4
    },
    inboundConfig = {
      proximity: {
        maximum: 5,
        minimum: 2
      },
      stops: {
        '1128': {
          redPin: 1,
          greenPin: 2
        }, 
        '1129': {
          redPin: 3,
          greenPin: 4
        },
        '1938': {
          redPin: 5,
          greenPin: 6
        }
      }
    },
    outboundConfig = {
      proximity: {
        maximum: 5,
        minimum: 2
      },
      stops: {
        '11164': {
          redPin: 7,
          greenPin: 8
        },
        '1164': {
          redPin: 9,
          greenPin: 10
        },
        '1162': {
          redPin: 11,
          greenPin: 12
        }
      }
    };

// Check --port options.
if(args) {
  if(args.hasOwnProperty('port')) {
    port = args.port;
  }
}
// Run server.
app
  .use(connect.logger('dev'))
  .use(connect.static(__dirname))
  .listen(port);

var proxyFactory = require(process.cwd() + '/script/massroute-proxy'),
    driver = require(process.cwd() + '/script/massroute-driver'),
    proxy;

switchModule = switchModuleFactory.create(switchConfig);
shifterModule = shifterModuleFactory.create(shiftConfig);
inboundModule = directionModuleFactory.create(inboundConfig, shifterModule);
outboundModule = directionModuleFactory.create(outboundConfig, shifterModule);

proxy = proxyFactory.getProxy('http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}');
driver.getDriver(proxy, switchModule, inboundModule, outboundModule);

logger.info('massroute-pi server started on port ' + port + '.');
