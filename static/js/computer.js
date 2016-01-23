var socket = io();
var uid;

socket.emit("new-device", {
  deviceType: Constants.COMPUTER
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
  $("#code").text(uid);
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

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}
render();
