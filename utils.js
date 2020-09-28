(function (w, d) {
  console.log("loading utils.js");

  // alias querySelector
  d.qs = d.querySelector

  // alias querySelectorAll
  d.qsa = d.querySelectorAll

  // alias for query selector all
  w.all = function (e, selector) {
    return e.querySelectorAll(selector);
  };

  // alias for Array.forEach
  w.foreach = function (arr, f) {
    Array.prototype.forEach.call(arr, f);
  };

  // alias for Array.map
  w.map = function (arr, f) {
    Array.prototype.map.call(arr, f);
  }

  // returns a random float value
  //
  // !n   : return a float in range [0, 1)
  // n > 0: return a value in range [0, n)
  // n < 0: return a value in range [-n, 0)
  w.random = function (n) {
    if (!n) {
      return Math.random();
    }
    // returns an integer value
    // 0 .. n-1 when n > 0
    // -n ..0-1 when n < 0
    return Math.floor(Math.random() * n) * 1.0;
  };
})(window, document);