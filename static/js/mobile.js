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
  socket.emit('test', {
    orientation: {
      x: event.alpha,
      y: event.beta,
      z: event.gamma
    }
  });
};

window.addEventListener("deviceorientation", handleOrientation, true);
