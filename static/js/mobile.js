var socket = io();
var uid;

var baseGamma;
var rawGamma;
var realOrientation = {};

socket.emit("new-device", {
  deviceType: Constants.MOBILE
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
});

$("#code-input").keypress(function (e) {
  if (e.which === 13) {
	e.preventDefault();
    socket.emit("link-devices", {
      uid: $(this).val()
    });
  }
});

$("#calibrate-button").click(function (e) {
	e.preventDefault();
	baseGamma = rawGamma;
});

var handleOrientation = function (event) {
	if (!baseGamma) {
		baseGamma = event.gamma;
	}
	rawGamma = event.gamma;
	realOrientation.x = event.alpha;
	realOrientation.y = event.beta;
	realOrientation.z = (90 + rawGamma - baseGamma)%180 - 90;

	if(Math.random() < 0.01) {
		console.log(realOrientation);
	}

	// console.log("Hi");
	// console.log(baseOrientation);
	// console.log(rawOrientation);
	// console.log(orientation);
	socket.emit("accel_data", {
		orientation: realOrientation
	});
};

window.addEventListener("deviceorientation", handleOrientation, true);
