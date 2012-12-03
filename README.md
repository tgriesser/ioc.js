ioc.js
======

[![Build Status](https://travis-ci.org/tgriesser/ioc.js.png)](https://travis-ci.org/tgriesser/ioc.js)

A simple service IoC service locator for javascript

**ioc.register(name, callback)**

Register an item with the ioc - the item can be any type, callback or otherwise

**ioc.registered(name)**

Returns a boolean, whether the name has been registered on the container

**ioc.replace(name, callback)**

Replaces an item in the registry with the second argument

**ioc.unregister(name)**

Removes the item from the registry by name

**ioc.singleton(name, callback)**

Registers a callback as a singleton. No-op if the second argument isn't a function

**ioc.resolve(name)**

Resolves the item associated with "name"