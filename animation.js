(function (w) {
  console.log("loading animation.js");

  // set global Anim object
  if (w.Anim) {
    return;
  }

  // _anim global
  const _anim = {};

  // global consts
  const _animating = {};
  const axes = ["", "X", "Y", "Z"];
  const degrees = 360.0;
  const fps = 60.0;
  const second = 1000.0;
  const seconds = 1.0;  // how long does the animation last?
  const gravity = 0.196;

  // delta's
  const degDelta = degrees / (fps * seconds);   // rotation
  const tickDuration = seconds * second / fps;  // ms

  // console.log(degDelta, tickDuration);

  // poor man's mutex
  var _animateMutex = 0;

  _anim.inc = function (k) {
    if (!_animating[k]) {
      // console.log("increment mutex");
      _animating[k] = true;
      _animateMutex++;
      return true;
    }
    return false;
  };

  _anim.dec = function (k) {
    if (_animating[k]) {
      // console.log("decrement mutex");
      _animating[k] = false;
      _animateMutex--;
      return true;
    }
    return false;
  };

  _anim.rotate = function (e, i) {
    var k = e + i;
    if (!_anim.inc(k)) return;

    var deg = 0;
    var dir = (random() >= 0.5) ? 1 : -1;
    var axis = axes[random(axes.length)];
    var rotateFn = function () {
      e.style.transform = "rotate" + axis + "(" + deg + "deg)";
      if (Math.abs(deg) < degrees) {
        deg += degDelta * dir;
        setTimeout(rotateFn, tickDuration);
      } else {
        _anim.dec(k);
        e.style.transform = "";
      }
    };
    rotateFn();
  };

  _anim.rotateChildren = function (e, selector) {
    w.foreach(w.all(e, selector), _anim.rotate);
  };

  _anim.jump = function (e, i) {
    var k = e + i;
    if (!_anim.inc(k)) return;

    var height = 0.0;
    var scale = 1.0;
    var minScale = 0.85;
    var velocity = 3.0;

    // jump states
    const preJump = Object();
    const jumping = Object();
    const falling = Object();
    const landing = Object();
    const postJump = Object();
    const jumpDone = Object();

    const Duration = {
      preJump: 0.15 * seconds,
      jumping: 0.375 * seconds,
      falling: 0.375 * seconds,
      landing: 0.1 * seconds
    };

    var jumpState = preJump;

    var jumpFn = function () {
      // console.log(jumpState);
      switch (jumpState) {
        case preJump:
          // console.log("preJump");
          jumpState = function () {
            if (scale > minScale) {
              scale -= Duration.preJump / ((1 - minScale) * tickDuration);
              // console.log(e, scale);
              e.style.transform = "scaleY(" + scale + ")";
              return preJump;
            } else {
              scale = 1.0;
              e.style.transform = "scaleY(" + scale + ")";
              return jumping;
            }
          }();
          break;
        case jumping:
          // console.log("jumping");
          jumpState = function () {
            if (velocity > 0.0) {
              velocity -= Duration.jumping / (gravity * tickDuration);
              height -= velocity;
              e.style.transform = "translateY(" + height + "px)";
              return jumping
            }
            return falling;
          }();
          break;
        case falling:
          // console.log("falling");
          jumpState = function () {
            if (height < 0) {
              velocity -= Duration.falling / (gravity * tickDuration);
              height -= velocity;
              e.style.transform = "translateY(" + height + "px)";
              return falling;
            }
            return landing;
          }();
          break;
        case landing:
          // console.log("landing");
          jumpState = function () {
            if (scale > minScale) {
              scale -= (Duration.landing / 2) / ((1 - minScale) * tickDuration);
              e.style.transform = "scaleY(" + scale + ")";
              return landing;
            }
            return postJump;
          }();
          break;
        case postJump:
          // console.log("postJump");
          jumpState = function () {
            if (scale < 1.0) {
              scale += (Duration.landing / 2) / ((1 - minScale) * tickDuration);
              e.style.transform = "scaleY(" + scale + ")";
              return postJump;
            } else {
              scale = 1.0;
              e.style.transform = "scaleY(" + scale + ")";
              return jumpDone;
            }
          }();
          break;
        default:
          // console.log("default");
          e.style.transform = "";
          _anim.dec(k)
          return;
      }
      // call this again
      // console.log("setTimeout(jumpFn, ", tickDuration, ");")
      setTimeout(jumpFn, tickDuration);
    };

    // execute jump
    jumpFn();
  };

  _anim.jumpChildren = (e, selector) => {
    var children = w.all(e, selector);
    var offset = second * seconds / children.length / 2;
    var start = 0;

    w.foreach(children, function (c, i) {
      function doIt() {
        _anim.jump(c, i);
      }
      setTimeout(doIt, start);
      start += offset;
    });
  };

  _anim.pickAnimation = function (e, selector) {
    return function () {
      if (_animateMutex === 0) {
        switch (random(3)) {
          case 0:
            _anim.rotate(e, 0); break;
          case 1:
            _anim.rotateChildren(e, selector); break;
          case 2:
            _anim.jump(e, 0); break;
          case 3:
            _anim.jumpChildren(e, selector); break;
        }
      }
    };
  };

  // set global object
  w.Anim = _anim;

})(window);
