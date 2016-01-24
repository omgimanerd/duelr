var socket = io();
var uid;
var renderer;
var scene;
var sword1;
var sword2;
var camera;

//Fade in interface
$('.img').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('.title').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('.paragraph').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 1000);
$('.code').css({top: 50, opacity: 0}).
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
  uid = data.uid;
  animateCode(uid);
});

socket.on('link-devices-response', function(data) {
  if (data.success) {
    hideInterface();
    createWorld();
    initializeGame();
    render();
  }
});

var hideInterface = function () {
  $("#welcome-interface").remove();
};

var createWorld = function () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  console.log ("World created");
};

var createPlayer1 = function (origin) {
  var geometry = new THREE.BoxGeometry( 50, 250, 50);
  var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  sword1 = new THREE.Mesh( geometry, material );
  sword1.position.x = origin.x;
  sword1.position.y = origin.y;
  sword1.position.z = origin.z;
  scene.add( sword1 );
  console.log("Created player 1");
  console.log(sword1);
};

var createPlayer2 = function (origin) {
  var geometry = new THREE.BoxGeometry( 50, 250, 50);
  var material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
  sword2 = new THREE.Mesh( geometry, material );
  sword2.position.x = origin.x;
  sword2.position.y = origin.y;
  sword2.position.z = origin.z;
  scene.add( sword2 );
  console.log("Created player 2");
  console.log(sword2);
};

var render = function () {
  // if (sword1) {
  //   console.log(sword1.position);
  // }
  requestAnimationFrame( render );
  renderer.render( scene, camera );
};

var initializeGame = function () {
  socket.on("server_update", function (data) {
    console.log(data.player2);
    if (data.player1) {
      if (!sword1) {
        createPlayer1(data.player1.swordOrigin);
      }
      sword1.rotation.x = (data.player1.swordHeading.x * Math.PI/180);
      sword1.rotation.y = -(data.player1.swordHeading.y * Math.PI/180);
      sword1.rotation.z = -(data.player1.swordHeading.z * Math.PI/180);
    }
    if (data.player2) {
      if (!sword2) {
        createPlayer2(data.player2.swordOrigin);
      }
      sword2.rotation.x = (data.player2.swordHeading.x * Math.PI/180);
      sword2.rotation.y = -(data.player2.swordHeading.y * Math.PI/180);
      sword2.rotation.z = -(data.player2.swordHeading.z * Math.PI/180);
    }
  });
};
