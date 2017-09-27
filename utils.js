(function(w, d) {
    // some global utility functions
    w.all = function(e, selector) {
        return e.querySelectorAll(selector);
    };

    w.foreach = function(arr, f) {
        Array.prototype.forEach.call(arr, f);
    };

    w.random = function(n) {
        if (!n) return Math.random();
        else return Math.floor(Math.random() * n);
    };
})(window, document);