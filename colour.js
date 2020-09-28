(function (w, d) {
  console.log("loading colour.js");

  // set global Colour object
  if (w.Colour) {
    return;
  }

  // colour global
  const colour = {};

  // set funcs
  colour.cycleChildren = (e, selector) => {
  }

  // set global object
  w.Colour = colour;

})(window, document);
