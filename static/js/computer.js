var socket = io();
var uid;

//Fade in interface
$('#img').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('#title').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 600);
$('#paragraph').css({top: 0, opacity: 0}).
animate({top: 50, opacity: 1}, 1000);
$('#code').css({top: 0, opacity: 0}).
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
        console.log(text);
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
};

socket.emit("new-device", {
  deviceType: Constants.COMPUTER
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
  animateCode(uid);
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 10, 100, 10 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var sword = new THREE.Mesh( geometry, material );
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

// var handleOrientation = function (event) {
// 	console.log(event);
// 	socket.emit("phone-accel", {
// 		uid: "a",
// 		accel:
// 	});
// };

// socket.on("accel-data", function (data) {
// 	sword.rotation.x = data.alpha * Math.PI/180;
// 	sword.rotation.y = data.beta * Math.PI/180;
// 	sword.rotation.z = data.gamma * Math.PI/180;
// });

// console.log("wtf");
// window.addEventListener("deviceorientation", handleOrientation, true);

var render = function () {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
};
render();