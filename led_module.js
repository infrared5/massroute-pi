var gpio = require('gpio'),
    gpio22 = gpio.export(22, {
      direction: 'out',
      ready: function() {
        // setInterval(function() {
        //   gpio22.set();
        //   setTimeout(function() { gpio22.reset(); }, 500);
        // }, 1000);
        var timeout = setTimeout(function() {
            clearTimeout(timeout);
            gpio22.set(1);
        }, 500);
      }
    });