(function() {

    var dao;

    module("jscache", {
        setup: function() {
            dao = {
                value: 0,
                getValue: function() {
                    return this.value;
                }
            };
        },
        teardown: function() {

        }
    });

    test("Object.cache exists", function() {

        ok(Object.cache);
        equal(typeof Object.cache, "function");

    });

    test("functions are wrapped", function() {

        var cached = Object.cache(dao);

        ok(cached, "There is a cached object");

        ok(cached.getValue, "Has wrapped around getValue");

    });

    test("functions still return expected values", function() {

        var cached = Object.cache(dao);

        dao.value = 10;

        equal(cached.getValue(), 10, "Method still returning the expected value");

    });

    test("value is cached on the second call", function() {

        var cached = Object.cache(dao);

        dao.value = 10;

        equal(cached.getValue(), 10, "Underlying method is called the first time");

        dao.value = 20;

        equal(cached.getValue(), 10, "Cache is used the second time");

    });

    test("can expire function", function() {

        var cached = Object.cache(dao);

        dao.value = 10;

        equal(cached.getValue(), 10, "Underlying method is called the first time");

        dao.value = 20;

        cached.getValue.expireCache();

        equal(cached.getValue(), 20, "Underlying method is called again after cache expiry");

    });

    test("variable are wrapped", function() {

        var obj = {
            counter: 1
        };

        var cached = Object.cache(obj);

        equal(cached.counter, 1,
              "The value on the object should be available on the cached object");

        obj.counter++;

        equal(cached.counter, 2,
              "Changes to the counter on the sub object should be accessible on the cached object");

    });

    test("cached functions have additional methods", function() {

        var obj = {
            getValue: function() {

            }
        };

        var cached = Object.cache(obj);

        ["expireCache", "getCache", "setCache"].forEach(function(methodName) {

            ok(cached.getValue[methodName],
               "Cached getValue function should have method " + methodName);

        });

    });

    test("one cache per argument", function() {

        var greeter = {
            greeting: "Hello",
            greet: function(name) {
                return this.greeting + " " + name;
            }
        };

        var cachedGreeter = Object.cache(greeter);

        equal(cachedGreeter.greet("Olly"), "Hello Olly");
        equal(cachedGreeter.greet("Rong"), "Hello Rong");

        greeter.greeting = "Hi";

        equal(cachedGreeter.greet("Olly"), "Hello Olly");
        equal(cachedGreeter.greet("Rong"), "Hello Rong");

        cachedGreeter.greet.expireCache();
        
        equal(cachedGreeter.greet("Olly"), "Hi Olly");
        equal(cachedGreeter.greet("Rong"), "Hi Rong");

    });

})();