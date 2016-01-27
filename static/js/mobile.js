var socket = io();
var uid;

var baseAlpha;
var rawAlpha;
var baseGamma;
var rawGamma;
var baseBeta;
var rawBeta;
var realOrientation = {};

socket.emit("new-device", {
  deviceType: Constants.MOBILE
});

socket.on('new-device-response', function(data) {
  console.log(data);
  uid = data.uid;
});

$("#code-submit").click(function (e) {
  e.preventDefault();
    socket.emit("link-devices", {
      uid: $("#code-input").val()
    });
    $("#code-input").hide();
    $(this).hide();
});

$("#code-input").keypress(function (e) {
  if (e.which === 13) {
  e.preventDefault();
    socket.emit("link-devices", {
      uid: $(this).val()
    });
    $(this).hide();
    $("#code-submit").hide();
  }
});

$("#calibrate-button").click(function (e) {
  e.preventDefault();
  baseAlpha = rawAlpha;
  baseGamma = rawGamma;
  baseBeta = rawBeta;
});

var handleOrientation = function (event) {
  if (!baseGamma) {
    baseAlpha = event.alpha;
    baseGamma = event.gamma;
    baseBeta = event.beta;
  }
  rawGamma = event.gamma;
  rawAlpha = event.alpha;
  rawBeta = event.beta;
  realOrientation.x = (360 + rawAlpha - baseAlpha) % 360;
  realOrientation.y = (180 + event.beta) % 360 - 180;
  realOrientation.z = (90 + rawGamma - baseGamma)%180 - 90;

  // if(Math.random() < 0.01) {
  // 	console.log(realOrientation);
  // }

  // console.log("Hi");
  // console.log(baseOrientation);
  // console.log(rawOrientation);
  // console.log(orientation);
  socket.emit("accel_data", {
    orientation: realOrientation
  });
};

window.addEventListener("deviceorientation", handleOrientation, true);
