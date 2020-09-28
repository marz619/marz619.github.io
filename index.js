(function (w, d) {
  console.log("loading index.js");

  // // onLoad 
  // var onLoad = function(loadFn) {
  //     if (d.readyState === "complete") {
  //         loadFn();
  //         return;
  //     }
  //     // otherwise add a listener
  //     d.addEventListener("DOMContentLoaded", loadFn);
  // };

  // returns if some v is a space or a letter
  const spaceOrLetter = (v) => (v === " ") ? "space" : "letter";

  // convert an item into a div
  const mkDivFn = (setClass) => {
    // console.log("mkDivFn");
    // function that will create a div
    const wrapper = (v, i) => {
      // console.log("mkDivFn::wrapper(", v, ", ", i, ")");

      var div = d.createElement("div");
      // set properties/attributes
      div.id = (i + 1).toString();
      div.className = setClass(v);
      div.setAttribute("unselectable", "on");
      div.textContent = v;
      // return
      return div;
    };
    // return the wrapping function
    return wrapper;
  }

  const textToArray = (text) => text.split("");

  const textToDivs = (text) => textToArray(text).map(mkDivFn(spaceOrLetter));

  const loader = () => {
    console.log("index::loader");

    // get the header text content and re-write each to be a div
    var header = d.qs("h1#header");
    var node = header.removeChild(header.firstChild);

    // reset header to be our new html
    textToDivs(node.textContent).forEach((c) => header.appendChild(c))

    // set onclick even on the header
    header.onclick = Anim.pickAnimation(header, "div.letter");

    // forever 3 second jump animation interval
    setInterval(Anim.jumpChildren, 3000, header, "div.letter");

    // // cycle colours forever
    // setInterval(Colour.cycleChildren, 3000, header, "div.letter");
  };

  // set onload
  w.onload = loader

})(window, document);
