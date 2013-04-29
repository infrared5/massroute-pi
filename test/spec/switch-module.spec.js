describe('switch-module', function() {
  
  var switchModule = require(process.cwd() + '/script/switch-module');

  describe('configure()', function() {

    var pin = 5;

    beforeEach(function() {
      switchModule.configure(pin);
    });

    afterEach(function() {
      spyOn(switchModule.module, 'unexport').andCallFake(function() {
        console.log('fall through');
      });
      // switchModule.dispose();
    });

    it('should define gpio module implementation', function() {
      expect(switchModule.module).not.toBeUndefined();
      expect(switchModule.module).not.toBeNull();
    });

  });

});