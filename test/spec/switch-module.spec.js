/*global require:false process:false describe:false beforeEach:false afterEach:false it:false spyOn:false expect:false*/
var gpio = require('gpio'),
    switchModuleFactory = require(process.cwd() + '/script/switch-module'),
    gpioHelper = require(process.cwd() + '/test/spec/helpers/gpio.helper');

describe('switch-module', function() {
  
  var configuration = {
        pin: 5
      },
      switchModule;

  beforeEach(function(done) {
      gpioHelper.stub(configuration.pin, done);
      switchModule = switchModuleFactory.create(configuration);
    });

    afterEach(function() {
      switchModule.dispose();
    });

  describe('configure()', function() {

    it('should define gpio module implementation', function() {
      expect(switchModule.module).not.toBeUndefined();
      expect(switchModule.module).not.toBeNull();
    });

    it('should emit on event based on change to \'on\' module state', function(done) {
      switchModule.on('on', function() {
        // if we go here, we were successful.
        expect(true).toEqual(true);
        done();
      });
      switchModule.module.emit('change', 1);
    });

    it('should emit off event based on change to \'off\' module state', function(done) {
      switchModule.on('off', function() {
        // if we go here, we were successful.
        expect(true).toEqual(true);
        done();
      });
      switchModule.module.emit('change', 0);
    });

  });

  describe('dispose()', function() {

    it('should unexport existant module', function() {
      var establishedModule = switchModule.module;
      spyOn(establishedModule, 'unexport');
      switchModule.dispose();
      expect(establishedModule.unexport).toHaveBeenCalled();
    });

  });

});