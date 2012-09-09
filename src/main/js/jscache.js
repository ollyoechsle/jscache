/**
 * Adds Polyfills for ECMAScript5 methods that JsCache depends on:
 * Object.create and Function.bind
 * If you don't plan on running JSCache on non ES5 browsers, feel free to delete this.
 */
(function addPolyFills() {
    if (!Object.create) {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
})();

/**
 * Creates JS Cache.
 * Exposes Object.cache
 */
(function JsCache() {

    function JsCache() {
        this.cache = {};
    }

    JsCache.prototype.cache = null;

    JsCache.prototype.hasCache = function(id) {
        return this.cache[id] !== undefined;
    };

    JsCache.prototype.expireCache = function() {
        this.cache = {};
    };

    JsCache.prototype.setCache = function(value, id) {
        this.cache[id] = value;
        return value;
    };

    JsCache.prototype.getCache = function(id) {
        return this.cache[id];
    };

    JsCache.prototype._addCacheAPIMethods = function(proxy) {
        var key, fn;
        for (key in this) {
            fn = this[key];
            if (typeof fn === "function" && key.charAt(0) !== "_") {
                proxy[key] = fn.bind(this);
            }
        }
        return proxy;
    };

    function createCacheProxy(fn) {

        var cacheInstance = new JsCache();

        return cacheInstance._addCacheAPIMethods(
            function jsCacheProxy() {

                var id = "key" + Array.prototype.slice.call(arguments).join(" ");

                if (!cacheInstance.hasCache(id)) {
                    return cacheInstance.setCache(fn.apply(this, arguments), id);
                } else {
                    return cacheInstance.getCache(id);
                }

            });

    }

    function createCacheProxies(proxy, object) {

        var key, fn;

        for (key in object) {

            fn = object[key];

            if (typeof fn === "function") {
                proxy[key] = createCacheProxy(fn);
            }

        }
    }

    Object.cache = function (object) {
        var proxy = Object.create(object);
        createCacheProxies(proxy, object);
        return proxy;
    };

})();