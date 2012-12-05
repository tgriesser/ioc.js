var TestItem = function () {
  this.counter = 0;
  this.increment = function() {
    this.counter++;
  };
};

describe('ioc.js', function () {

  var ioc = require('../index');

  it('index.js should export an ioc object', function () {
    ioc.should.be.a('object').and.have.property('register');
  });

  it('should allow us to register item "testing"', function () {
    ioc.register('testing', function () {
      return new TestItem();
    });
    ioc.isRegistered('testing').should.equal(true);
  });

  it('should later allow us to resolve the test item', function () {
    var instance = ioc.resolve('testing');
    instance.should.have.property('increment');
    instance.increment();
    instance.counter.should.equal(1);
  });

  it('should allow us to create a second item', function () {
    var instance = ioc.resolve('testing');
    instance.should.have.property('increment');
    instance.increment();
    instance.counter.should.equal(1);
  });

  it('should let us unregister the item', function () {
    ioc.unregister('testing');
    ioc.isRegistered('testing').should.equal(false);
  });

  it('should allow us to register a singleton', function () {
    ioc.singleton('testing', function () {
      return new TestItem();
    });
    ioc.isRegistered('testing').should.equal(true);
  });

  it('should allow us to resolve the singleton', function () {
    var instance = ioc.resolve('testing');
    instance.should.have.property('increment');
    instance.increment();
    instance.counter.should.equal(1);
  });

  it('should return the same singleton instance', function () {
    var instance = ioc.resolve('testing');
    instance.should.have.property('increment');
    instance.increment();
    instance.counter.should.equal(2);
  });

  it('should allow us to replace one instance with another', function () {
    ioc.replace('testing', function () {
      return new TestItem();
    });
    ioc.isRegistered('testing').should.equal(true);
  });

  it('should throw an error when trying to invoke a non registered item', function () {
    (function(){
      ioc.resolve('NotHere');
    }).should['throw']();
  });

  it('should throw an error when trying to register an already registered name', function () {
    (function(){
      ioc.register('testing', {});
    }).should['throw']();
  });

  it('should throw an error when trying to replace a non existent item', function () {
    (function(){
      ioc.replace('NotHere', {});
    }).should['throw']();
  });

  it('should allow registering of any non-null type', function () {
    ioc.register('string', 'string');
    ioc.register('number', 1);
    ioc.register('obj', {});
    ioc.register('arr', []);

    ioc.resolve('string').should.be.a('string');
    ioc.resolve('number').should.be.a('number');
    ioc.resolve('obj').should.be.a('object');
    ioc.resolve('arr').should.be.an.instanceOf(Array);
  });

  it('should not return a singleton twice, even if the result is a function', function () {

    var Singleton = function () {
      var x = function () {
        throw new Error('This should not execute');
      };
      return x;
    };

    ioc.singleton('singleton', Singleton);

    (function(){

      ioc.resolve('singleton');
      ioc.resolve('singleton');
    
    }).should.not['throw']();
  });

  it('should use registerOrReplace to register or replace existing', function () {

    ioc.registerOrReplace('newItem', function () {
      return 'test';

    });

    ioc.resolve('newItem').should.equal('test');

    ioc.registerOrReplace('singleton', function () {
      return 'newSingleton';
    }, true);

    ioc.resolve('singleton').should.equal('newSingleton');

  });

});