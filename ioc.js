//
// A simple service locator pattern IoC
//
// Inspired by Laravel http://laravel.com/docs/ioc
// @author  Tim Griesser
// @license MIT
// --------------------------------
(function () {

  var registers = {};

  var singletons = {};

  /**
   * Alias to ioc.resolve
   */
  var ioc = function () {
    
    return ioc.resolve.apply(ioc, arguments);
  
  };

  /**
   * Registers an item in the IoC register
   * @param string
   * @param mixed
   * @return ioc
   */
  ioc.register = function(name, callback) {
    
    if (this.isRegistered(name)) {

      throw new Error(name + ' is already registered in the IoC container. Use ioc.replace to replace it.');

    }

    registers[name] = callback;

    return this;
  };

  /**
   * Replaces an item registered in the IoC
   * with another object or callback
   * @param string
   * @param mixed
   * @param bool
   * @return ioc
   */
  ioc.replace = function (name, callback, singleton) {

    if ( ! this.isRegistered(name)) {

      throw new Error(name + ' must be registered in the IoC container to replace it.');
    
    }

    this.unregister(name);

    this[(singleton ? 'singleton' : 'register')](name, callback);
    
    return this;
  };

  /**
   * Registers an item if it doesn't exist yet,
   * replaces it otherwise
   * @param string
   * @param mixed
   * @param bool
   * @return ioc
   */
  ioc.registerOrReplace = function (name, callback, singleton) {

    if (this.isRegistered(name)) {

      this.replace(name, callback, singleton);
    
    } else {

      this[(singleton ? 'singleton' : 'register')](name, callback);

    }

    return this;
  };

  /**
   * Checks whether an item has been registered
   * in the ioc
   * @param string
   * @return bool
   */
  ioc.isRegistered = function (name) {
    
    return (registers[name] !== void 0);
  
  };

  /**
   * Unregister the item
   * @param string
   * @return ioc
   */
  ioc.unregister = function (name) {
    
    if ( ! this.isRegistered(name)) {
    
      throw new Error(name + ' must be registered in the IoC to unregister it');
    
    }

    delete registers[name];

    if (singletons[name]) delete singletons[name];

    return this;
  };

  /**
   * Register a function as a singleton
   * @param string
   * @param string
   * @return ioc
   */
  ioc.singleton = function (name, callback) {
    
    if (this.isRegistered(name)) {

      throw new Error(name + ' is already registered in the IoC container. Use ioc.replace to replace it.');
    
    }

    registers[name] = function () {
      
      if (typeof registers[name] === 'function') {

        registers[name] = callback.apply(this, arguments);
      
      } else {

        registers[name] = callback;

      }

      singletons[name] = true;

      return registers[name];

    };

    return this;
  };

  /**
   * Resolves an item, passing along any arguments
   * @param string
   * @param array
   * @param object
   */
  ioc.resolve = function (name, args, context) {

    if ( ! this.isRegistered(name)) {

      throw new Error(name + ' is not registered in the IoC container');

    }

    if (typeof registers[name] === 'function' && ! singletons[name]) {

      return registers[name].apply(context, args);

    } else {

      return registers[name];

    }

  };

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    
    define('ioc', [], function() {
      
      return ioc;
    
    });

  }
  
  if (typeof exports !== 'undefined') {
    
    if (typeof module !== 'undefined' && module.exports) {
    
      exports = module.exports = ioc;
    
    }
    
    exports.ioc = ioc;

  } else {

    var global = this;

    global['ioc'] = ioc;

  }

}).call(this);