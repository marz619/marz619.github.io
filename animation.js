(function(w) {

    // set global Anim object
    if (w.Anim) {
        return;
    }

    // anim global
    var anim = {};

    // global consts
    var animating = {};
    var axes = ['', 'X', 'Y', 'Z'];
    var degrees = 360;
    var fps = 60;
    var second = 1000;
    var seconds = 1;
    var gravity = 0.098;

    // delta's
    var degDelta = degrees / (fps * seconds);
    var timeout = seconds * second / fps;

    // a poor man's sync mutex
    var animateMutex = 0;

    anim.inc = function(k) {
        if (!animating[k]) {
            animating[k] = true;
            animateMutex++;
            return true;
        }
        return false;
    };

    anim.dec = function(k) {
        if (animating[k]) {
            animating[k] = false;
            animateMutex--;
        }
    };

    anim.rotate = function(e, i) {
        var k = e + i;
        if (!anim.inc(k)) return;

        var deg = 0;
        var dir = (random() >= 0.5) ? 1 : -1;
        var axis = axes[random(axes.length)];
        var rotateFn = function() {
            e.style.transform = "rotate" + axis + "(" + deg + "deg)";
            if (Math.abs(deg) < 360) {
                deg += degDelta * dir;
                setTimeout(rotateFn, timeout);
            } else {
                anim.dec(k);
                e.style.transform = "";
            }
        };
        rotateFn();
    };

    anim.rotateChildren = function(e, selector) {
        foreach(all(e, selector), anim.rotate);
    };

    anim.jump = function(e, i) {
        var k = e + i;
        if (!anim.inc(k)) return;

        var height = 0;
        var scale = 1.0;
        var minScale = 0.9;
        var velocity = 4;

        var duration = {
            preJump: 0.2 * seconds,
            jump: 0.35 * seconds,
            fall: 0.35 * seconds,
            land: 0.1 * seconds
        };
        var preJump = true;
        var jumping = false;
        var falling = false;
        var landing = false;
        var postJump = false;
        

        var jumpFn = function() {
            if (preJump) {
                if (scale > minScale) {
                    scale -= duration.preJump / ((1 - minScale) * timeout);
                } else {
                    scale = 1.0;
                    preJump = false;
                    jumping = true;
                }
                e.style.transform = "scaleY(" + scale + ")";
            } else if (jumping) {
                if (velocity > 0) {
                    velocity -= duration.jump / (gravity * timeout);
                    height -= velocity;
                    e.style.transform = "translateY(" + height + "px)";
                } else {
                    jumping = false;
                    falling = true;
                }
            } else if (falling) {
                if (height < 0) {
                    velocity -= duration.fall / (gravity * timeout);
                    height -= velocity;
                    e.style.transform = "translateY(" + height + "px)";
                } else {
                    falling = false;
                    landing = true;
                }
            } else if (landing) {
                if (scale > minScale) {
                    scale -= (duration.land / 2) / ((1 - minScale) * timeout);
                    e.style.transform = "scaleY(" + scale + ")";
                } else {
                    landing = false;
                    postJump = true;
                }
            } else if (postJump) {
                if (scale < 1.0) {
                    scale += (duration.land / 2) / ((1 - minScale) * timeout);
                } else {
                    postJump = false;
                    scale = 1.0;
                }
                e.style.transform = "scaleY(" + scale + ")";
            } else {
                e.style.transform = "";
                anim.dec(k);
                return;
            }
            setTimeout(jumpFn, timeout);
        };

        jumpFn();
    };

    anim.jumpChildren = function(e, selector) {
        var children = all(e, selector);
        var offset = second * seconds / children.length / 2;
        var start = 0;

        foreach(children, function(c, i) {
            function doo() {
                anim.jump(c, i);
            }
            setTimeout(doo, start);
            start += offset;
        });
    };

    anim.pickAnimation = function(e, selector) {
        return function() {
            if (!animateMutex) {
                switch (random(4)) {
                    case 0:
                        anim.rotate(e, 0); break;
                    case 1:
                        anim.rotateChildren(e, selector); break;
                    case 2:
                        anim.jump(e, 0); break;
                    case 3:
                        anim.jumpChildren(e, selector); break;
                }
            }
        };
    };

    // set global object
    w.Anim = anim;

})(window);
