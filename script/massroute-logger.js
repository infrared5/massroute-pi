var level = 7,
    logger = new (require('caterpillar').Logger)({level:level}),
    filter = new (require('caterpillar-filter').Filter)(),
    human  = new (require('caterpillar-human').Human)(),
    curryLog = function(type) {
      return function(message) {
        logger.log(type, message);
      }
    };

logger.pipe(filter).pipe(human).pipe(process.stdout);

module.exports = {
  log: curryLog('info'),
  info: curryLog('info'),
  error: curryLog('error'),
  warning: curryLog('warning'),
  debug: curryLog('debug')
};