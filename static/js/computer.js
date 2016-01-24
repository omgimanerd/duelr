var socket = io();
var uid;
var renderer;
var scene;
var sword;
var camera;

//Fade in interface
$('#img').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('#title').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('#paragraph').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 1000);
$('#code').css({top: 50, opacity: 0}).
animate({top: 50, opacity: 1}, 1500);

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'static/assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});

//Creates cool number effect for the code
var animateCode = function (code) {
    var BITS_ID = 'code';
    var BITS_TEXT = code;
    var BITS_ANIMATE_INTERVAL = 75.0;
    var BITS_ANIMATE_DURATION = 5000.0;
    var bitsTextTicks = 0;
    var animateBITS_ID = window.setInterval(function() {
        var len = Math.floor(bitsTextTicks / (BITS_ANIMATE_DURATION / BITS_ANIMATE_INTERVAL) * 10);
        var text = BITS_TEXT;
        for (i = len; i < 4; i++) {
            text = text.substr(0, i) + (Math.random() > 0.5 ? '1' : '0') + text.substr(i + 1);
        }
        document.getElementById(BITS_ID).innerHTML = text;
        bitsTextTicks++;
    }, BITS_ANIMATE_INTERVAL);
    window.setTimeout(function() {
        window.clearInterval(animateBITS_ID);
        document.getElementById(BITS_ID).innerHTML = BITS_TEXT;
    }, BITS_ANIMATE_DURATION);
};

socket.emit("new-device", {
  deviceType: Constants.COMPUTER
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
  animateCode(uid);
});

socket.on('link-devices-response', function(data) {
  console.log("anal");
  if (data.success) {
    hideInterface();
    createWorld();
    initializeGame();
  }
});

var hideInterface = function () {
  $("#welcome-interface").remove();
};

var createWorld = function () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 10, 100, 10 );
  var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  sword = new THREE.Mesh( geometry, material );
  sword.position.x = 0;
  sword.position.y = 0;
  sword.position.z = 0;
  scene.add( sword );

  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF, 1, 1000);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  camera.position.z = 300;

  render();
};

var render = function () {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
};

var initializeGame = function () {
  socket.on(window.Constants.SERVER_TO_CLIENT_SOCKET_TAG, function (data) {
    console.log(data);
    sword.rotation.x = data.x * Math.PI/180;
    sword.rotation.y = data.y * Math.PI/180;
    sword.rotation.z = data.z * Math.PI/180;
  });
};