(function() {

    if (!Object.create) {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    function cache(fn) {

        return function() {

            var cached = fn["__cached"];

            if (!cached) {
                cached = fn.apply(this, arguments);
                fn["__cached"] = cached;
            }

            return cached;

        };

    }

    function init(proxy, object) {

        var key, fn;

        for (key in object) {

            fn = object[key];

            if (typeof fn === "function") {
                proxy[key] = cache(fn);
            }

        }
    }

    Object.cache = function (object) {
        var proxy = Object.create(object);
        init(proxy, object);
        return proxy;
    };

})();