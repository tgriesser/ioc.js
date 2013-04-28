//
// A simple service locator
// @author  Tim Griesser
// @license MIT
//
(function () {

  // Reference variables to prototypes.
  var slice = Array.prototype.slice;

  /**
   * Alias to ioc.resolve
   */
  var ioc = function () {
    return ioc.resolve.apply(ioc, arguments);
  };

  var registers  = ioc._registers  = {};
  var singletons = ioc._singletons = {};

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
    if (!this.isRegistered(name)) {
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
      if (typeof callback === 'function') {
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
  ioc.resolve = function (name /* args */) {
    if ( ! this.isRegistered(name)) {
      throw new Error(name + ' is not registered in the IoC container');
    }
    if (typeof registers[name] === 'function' && ! singletons[name]) {
      return registers[name].apply(this, slice.call(arguments, 1));
    } else {
      return registers[name];
    }
  };

  /**
   * Creates one or more aliases to an existing object
   * @param  string
   * @param* string
   * @return object
   */
  ioc.alias = function (name /* aliases */) {
    var targets = slice.call(arguments, 1);
    var ref = registers[name];
    for (var i=0, l=targets.length; i<l; i++) {
      registers[targets[i]] = ref;
    }
    return this;
  };

  /**
   * Invokes an item as a constructor, with any trailing arguments applied
   * @param  string
   * @param* mixed
   * @return object
   */
  ioc.ctor = function (name) {
    var fn = registers[name]();
    if (typeof fn !== 'function') {
      throw new Error(name + 'is not a function in the IoC container');
    }
    function Ctor() {}
    Ctor.prototype = fn.prototype;
    var inst = new Ctor();
    var obj  = fn.apply(inst, slice.call(arguments, 1));
    return  Object(obj) === obj ? obj : inst;
  };

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define('ioc', [], function() {
      return ioc;
    });
  } else if (typeof exports === "object") {
    module.exports = ioc;
  } else {
    var global = this;
    global['ioc'] = ioc;
  }

}).call(this);