$(document).ready(function(){
  $('#img').css({top: 0, opacity: 0}).
    animate({top: 50, opacity: 1}, 600);
  $('#title').css({top: 0, opacity: 0}).
    animate({top: 50, opacity: 1}, 600);
  $('#paragraph').css({top: 0, opacity: 0}).
    animate({top: 50, opacity: 1}, 1000);
  $('#code').css({top: 0, opacity: 0}).
    animate({top: 50, opacity: 1}, 1500);
  animatecode();

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'static/assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});
});

function animatecode() { //animates the BITS exchange 
    const BITS_ID = 'code';
    const BITS_TEXT = '157319';
    const BITS_ANIMATE_INTERVAL = 75.0;
    const BITS_ANIMATE_DURATION = 5000.0;
    var bitsTextTicks = 0;
    var animateBITS_ID = window.setInterval(function() {
        var len = Math.floor(bitsTextTicks / (BITS_ANIMATE_DURATION / BITS_ANIMATE_INTERVAL) * 10);
        var text = BITS_TEXT;
        for (i = len; i < 6; i++) {
            text = text.substr(0, i) + (Math.random() > 0.5 ? '1' : '0') + text.substr(i + 1);
        }
        document.getElementById(BITS_ID).innerHTML = text;
        bitsTextTicks++;
    }, BITS_ANIMATE_INTERVAL);
    window.setTimeout(function() {
        window.clearInterval(animateBITS_ID);
        document.getElementById(BITS_ID).innerHTML = BITS_TEXT;
    }, BITS_ANIMATE_DURATION);
}
