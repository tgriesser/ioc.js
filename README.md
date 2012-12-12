ioc.js
======

[![Build Status](https://travis-ci.org/tgriesser/ioc.js.png)](https://travis-ci.org/tgriesser/ioc.js)

A simple IoC service locator for javascript

**ioc.register(name, callback)**

Register an item with the ioc - the item can be any type, callback or otherwise

**ioc.replace(name, callback, singleton)**

Replaces an item in the registry with the second argument. Pass true as the
third argument to register as a singleton

**ioc.registerOrReplace(name, callback, singleton)**

Registers an item if it doesn't exist yet, replaces it otherwise

**ioc.isRegistered(name)**

Returns a boolean, whether the name has been registered on the container

**ioc.unregister(name)**

Removes the item from the registry by name

**ioc.singleton(name, callback)**

Registers a callback as a singleton. No-op if the second argument isn't a function

**ioc.resolve(name, args, context)**

Resolves the item associated with "name", with an optional array passed in
as arguments, and optional "context" used when invoking a callback.

## Examples

```javascript

var ioc = require('ioc');

ioc.register('pageView', function (opts) {
  
  return (new (Backbone.View.extend({
    initialize: function (){
      
    },
    render: function () {
      this.$el.html('Hello World');
    }
  }))(opts));
  
});

var pageView = ioc.resolve('pageView', [{model:model}]);
var pageView2 = ioc.resolve('pageView', [{model:model2}]);

```

## License

MIT


