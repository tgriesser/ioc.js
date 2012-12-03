//
// A simple service locator pattern IoC
//
// Inspired by Laravel http://laravel.com/docs/ioc
// @author  Tim Griesser
// @license MIT
// --------------------------------
(function () {

  var global = this;
  
  var registers = {};

  var ioc = {};

  /**
   * Registers an item in the IoC register
   * @param string
   * @param mixed
   */
  ioc.register = function(name, callback) {
    
    if (this.registered(name)) {

      throw new Error(name + ' is already registered in the IoC container. Use ioc.replace to replace it.');

    }

    registers[name] = callback;

    return this;

  };

  /**
   * Checks whether an item has been registered
   * in the ioc
   */
  ioc.registered = function (name) {
    
    return (registers[name] !== void 0);
  
  };

  /**
   * Unregister the item
   * @param string
   * @return ioc
   */
  ioc.unregister = function (name) {
    
    if ( ! this.registered(name)) {
    
      throw new Error(name + ' must be registered in the IoC to unregister it');
    
    }

    delete registers[name];

    return this;

  };

  /**
   * Replaces an item registered in the IoC
   * with another object or callback
   * @param string
   * @param mixed
   */
  ioc.replace = function (name, callback, singleton) {

    if ( ! this.registered(name)) {

      throw new Error(name + ' must be registered in the IoC container to replace it.');
    
    }

    this.unregister(name);

    this[(singleton ? 'singleton' : 'register')](name, callback);
    
    return this;

  };

  /**
   * Register a function as a singleton
   * @param string
   * @param string
   * @return ioc
   */
  ioc.singleton = function (name, callback) {
    
    if (this.registered(name)) {

      throw new Error(name + ' is already registered in the IoC container. Use ioc.replace to replace it.');
    
    }

    registers[name] = function () {
      
      if (typeof registers[name] === 'function') {

        registers[name] = callback.apply(this, arguments);
      
      } else {

        registers[name] = callback;

      }

      return registers[name];

    };

    return this;

  };

  /**
   * Resolves an item, passing along any arguments
   */
  ioc.resolve = function (name, args, context) {

    if ( ! this.registered(name)) {

      throw new Error(name + ' is not registered in the IoC container');

    }

    if (typeof registers[name] === 'function') {

      return registers[name].apply(context, args);

    } else {

      return registers[name];

    }

  };


  if (typeof exports !== 'undefined') {
    
    if (typeof module !== 'undefined' && module.exports) {
    
      exports = module.exports = ioc;
    
    }
    
    exports.ioc = ioc;
  
  } else {
  
    root['ioc'] = ioc;
  
  }

}).call(this);