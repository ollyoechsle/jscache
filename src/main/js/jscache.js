(function() {

    if (!Object.create) {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    function JsCache() {
        this.cachedValue = undefined;
    }

    JsCache.prototype.cachedValue = undefined;

    JsCache.prototype.expireCache = function() {
        this.cachedValue = null;
    };

    JsCache.prototype.hasCache = function() {
        return this.cachedValue !== undefined;
    };

    JsCache.prototype.getCache = function() {
        return this.cachedValue;
    };

    JsCache.prototype.setCache = function(value) {
        this.cachedValue = value;
        return value;
    };

    function cache(fn) {

        var cacheInstance = new JsCache(fn);

        return function jsCacheProxy() {

            if (!cacheInstance.hasCache()) {
                return cacheInstance.setCache(fn.apply(this, arguments));
            } else {
                return cacheInstance.getCache();
            }

        };

    }

    function createCacheMethods(proxy, object) {

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
        createCacheMethods(proxy, object);
        return proxy;
    };

})();