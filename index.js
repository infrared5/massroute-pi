/*global require:false __dirname:false console:false*/
var args = require('optimist').argv,
    path = require('path'),
    request = require('request'),
    connect = require('connect'),
    app = connect(),
    port = 3001,
    url = 'http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}',
    pingCount = 0,
    // in, out final stops hit up first to get predictions.
    stopIds = ['1129', '11164', '1938', '1128', '1162', '1164'];

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

// /**
//  * Requests predictions from JSON service.
//  */
// function getPredictions() {
//   var stopIndex = (pingCount % stopIds.length),
//       stopId = stopIds[stopIndex];

//   console.log('request: ' + url.replace('{0}', stopId));
  
//   request({
//     uri: url.replace('{0}', stopId),
//     json: true
//   }, function(err, response, body) {  
//     var predictions,
//         prediction,
//         seconds;

//     if(err) {
//       // TODO: Send error message.
//       console.error('Error: ' + err);
//     }
//     else {
//       predictions = body.predictions;
//       if(predictions && predictions.length > 0) {
//         prediction = predictions[0];
//         seconds = prediction.seconds ? parseInt(prediction.seconds, 10) : -1;
//         if(seconds > -1) {
//           console.log('stop ' + stopId + ': ' + seconds);
//         }
//       }
//     }
//   });
//   // reset ping so as not to get out of control.
//   if(++pingCount == stopIds.length) {
//     pingCount = 0;
//   }
// }
// // every 10-seconds per MassDOT restirctions.
// setInterval(getPredictions, 10000);

var proxyFactory = require('proxy'),
    driver = require('driver');

driver.getProxy('http://68.169.43.76:3001/routes/39/destinations/39_1_var1/stops/{0}');

console.log('massroute-pi server started on port ' + port + '.');