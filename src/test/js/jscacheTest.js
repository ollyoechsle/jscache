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

    test("variable are wrapped", function() {

        var obj = {
            counter: 1
        };

        var cached = Object.cache(obj);

        equal(cached.counter, 1, "The value on the object should be available on the cached object");

        obj.counter++;

        equal(cached.counter, 2, "Changes to the counter on the sub object should be accessible on the cached object");


    });

})();