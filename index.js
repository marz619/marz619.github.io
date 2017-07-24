(function(w, d) {
    var onLoad = function(readyFn) {
        if (d.readyState !== 'loading') {
            readyFn();
            return;
        }
        // otherwise add a listener
        d.addEventListener('DOMContentLoaded', readyFn);
    };

    var loader = function() {
        // get the header text content and re-write each to be a div
        var header = d.querySelector('h1#header');
        var newHTML = '';
        header.textContent.split('').forEach(function(l, i) {
            var clazz = (l === ' ') ? 'space' : 'letter';
            newHTML += '<div id="' + (i+1) + '" unselectable="on" class="' + clazz +'">' + l + '</div>';
        });

        header.innerHTML = newHTML;
        header.onclick = Anim.pickAnimation(header, 'div.letter');

        // 5 second jump animation interval
        setInterval(Anim.jumpChildren, 5000, header, 'div.letter')
    };

    // load
    onLoad(loader);
})(window, document);