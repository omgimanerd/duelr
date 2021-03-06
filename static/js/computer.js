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

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 400;
  pointLight.position.y = 0;
  pointLight.position.z = 0;

  var pointLight2 = new THREE.PointLight(0xFFFFFF);
  pointLight2.position.x = -400;
  pointLight.position.y = 0;
  pointLight.position.z = 0;

  scene.add(pointLight);
  scene.add(pointLight2);

  console.log ("World created");
};

var createPlayer1 = function (origin) {
  var geometry = new THREE.BoxGeometry(60, 11, 11);
  var material = new THREE.MeshLambertMaterial( { color: 0x663300 } );
  var temp = new THREE.Mesh( geometry, material );
  temp.position.x = 9;
  temp.position.y = 0;
  temp.position.z = 0;

  var geometryBlade = new THREE.BoxGeometry(250, 3, 20);
  var materialBlade = new THREE.MeshPhongMaterial( { color:  0xf2f2f2 } );
  var blade = new THREE.Mesh( geometryBlade, materialBlade );
  blade.position.x = 146;
  blade.position.y = 0;
  blade.position.z = 0;

  var geometryHandle = new THREE.BoxGeometry( 20, 12, 50);
  var materialHandle = new THREE.MeshBasicMaterial( { color: 0xe5e600 } );
  var handle = new THREE.Mesh( geometryHandle, materialHandle );
  handle.position.x = 30;
  handle.position.y = 0;
  handle.position.z = 0;


  sword1 = new THREE.Object3D();
  sword1.position.x = origin.x;
  sword1.position.y = origin.y;
  sword1.position.z = origin.z;
  sword1.add(temp);
  sword1.add(handle);
  sword1.add(blade);

  sword1.rotation.order = "YZX";
  scene.add( sword1 );
  console.log("Created player 1");
  console.log(sword1);
};

var createPlayer2 = function (origin) {
  var geometry2 = new THREE.BoxGeometry(60, 11, 11);
  var material2 = new THREE.MeshLambertMaterial( { color: 0x4d79ff } );
  var temp2 = new THREE.Mesh( geometry2, material2 );
  temp2.position.x = 9;
  temp2.position.y = 0;
  temp2.position.z = 0;

  var geometryBlade2 = new THREE.BoxGeometry(250, 3, 20);
  var materialBlade2 = new THREE.MeshPhongMaterial( { color:  0xe5f2ff } );
  var blade2 = new THREE.Mesh( geometryBlade2, materialBlade2 );
  blade2.position.x = 146;
  blade2.position.y = 0;
  blade2.position.z = 0;

  var geometryHandle2 = new THREE.BoxGeometry( 20, 12, 50);
  var materialHandle2 = new THREE.MeshBasicMaterial( { color: 0x001966 } );
  var handle2 = new THREE.Mesh( geometryHandle2, materialHandle2 );
  handle2.position.x = 30;
  handle2.position.y = 0;
  handle2.position.z = 0;

  sword2 = new THREE.Object3D();
  sword2.position.x = origin.x;
  sword2.position.y = origin.y;
  sword2.position.z = origin.z;
  sword2.add(temp2);
  sword2.add(blade2);
  sword2.add(handle2);

  sword2.rotation.order = "YZX";
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

var pointCameraAtPlayer = function (player) {
  if (player === 1) {
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = -300;
    camera.rotation.y = -Math.PI/2;
    // camera.lookAt(sword1.position);
  } else {
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 300;
    camera.rotation.y = Math.PI/2;
  }
};

var initializeGame = function () {
  socket.on("server_update", function (data) {
    if(Math.random() < 0.04) {
      console.log(data);
    }
    if (data.player1) {
      if (!sword1) {
        createPlayer1(data.player1.swordOrigin);
        console.log(data.player1.uid);
        console.log(uid);
        if (data.player1.uid === uid) {
          pointCameraAtPlayer(1);
        }
      }
      sword1.rotation.y = (data.player1.swordHeading.x * Math.PI/180);
      sword1.rotation.z = (data.player1.swordHeading.y * Math.PI/180);
      sword1.rotation.x = (data.player1.swordHeading.z * Math.PI/180);
    }
    if (data.player2) {
      if (!sword2) {
        createPlayer2(data.player2.swordOrigin);
        if (data.player2.uid === uid) {
          pointCameraAtPlayer(2);
        }
      }
      sword2.rotation.y = (data.player2.swordHeading.x * Math.PI/180);
      sword2.rotation.z = (data.player2.swordHeading.y * Math.PI/180);
      sword2.rotation.x = (data.player2.swordHeading.z * Math.PI/180);
    }
  });
};
