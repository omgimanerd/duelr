var socket = io();
var uid;

socket.emit("new-device", {
  deviceType: Constants.MOBILE
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
});

$("#code-input").keypress(function (e) {
  if (e.which === 13) {
    socket.emit("link-devices", {
      uid: $(this).val()
    });
  }
});

var handleOrientation = function (event) {
	console.log(event);
	socket.emit(Constants.ACCELEROMETER_DATA_SOCKET_TAG, {
		orientation: {
			x: event.alpha,
			y: event.beta,
			z: event.gamma
		}
	});
};

window.addEventListener("deviceorientation", handleOrientation, true);