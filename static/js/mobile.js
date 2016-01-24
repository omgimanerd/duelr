var socket = io();
var uid;

var baseOrientation;
var rawOrientation;

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

var handleOrientation = function (event) {
	rawOrientation = {
		x: event.alpha,
		y: event.beta,
		z: event.gamma
	};
  socket.emit("accel_data", {
    orientation: {
      x: event.alpha,
      y: event.beta,
      z: event.gamma
    }
  });
};

window.addEventListener("deviceorientation", handleOrientation, true);
