/**
 * This is the app script that is run on the server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @todo Add unit tests!
 */

var DEV_MODE = false;
var FRAME_RATE = 1000.0 / 60.0;
var IP = process.env.IP || "localhost";
var PORT_NUMBER = process.env.PORT || 5000;

process.argv.forEach(function(value, index, array) {
  if (value == "--dev" || value == "--development") {
    DEV_MODE = true;
  }
});

// Dependencies.
var express = require("express");
var http = require("http");
var MobileDetect = require('mobile-detect');
var morgan = require("morgan");
var socketIO = require("socket.io");
var swig = require("swig");

var ClientManager = require("./server/ClientManager");
var Constants = require("./shared/Constants");
var Game = require("./server/Game");

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);

var clientManager = ClientManager.create();
var game = Game.create();

app.engine("html", swig.renderFile);

app.set("port", PORT_NUMBER);
app.set("view engine", "html");

app.use(morgan(":date[web] :method :url :req[header] :remote-addr :status"));
app.use("/bower_components",
        express.static(__dirname + "/bower_components"));
app.use("/static",
        express.static(__dirname + "/static"));
app.use("/shared",
        express.static(__dirname + "/shared"));

// Routing
app.get("/", function(request, response) {
  // Render a different page depending on whether or not the request came
  // from a phone or a computer.
  var md = new MobileDetect(request.headers["user-agent"]);
  response.render("index.html", {
    mobile: md.mobile()
  });
});

app.get('/game', function(request, response) {
  response.render('game.html', {
    dev_mode: DEV_MODE
  });
});

// Server side input handler, modifies the state of the players and the
// game based on the input it receives. Everything runs asynchronously with
// the game loop.
io.on("connection", function(socket) {
  // When a new player joins, the server adds a new player to the game.
  socket.on("new-device", function(data) {
    var uid = clientManager.addClient(socket, data.deviceType);
    socket.emit("new-device-response", {
      success: true,
      uid: uid
    });
  });

  // This should only be sent by mobile devices.
  socket.on("link-devices", function(data) {
    // uid should be the uid of the mobile device from which this packet
    // originated.
    var uid = clientManager.getUid(socket);
    // uidToConnectTo is the uid they are requesting to connect to, which
    // should be the uid of a computer.
    var uidToConnectTo = data.uid;
    if (!clientManager.isPairable(uid, uidToConnectTo)) {
      socket.emit("link-devices-response", {
        success: false,
        message: "You must be a mobile device connecting to a computer!"
      });
    } else if (game.isFull()) {
      socket.emit("link-devices-response", {
        success: false,
        message: "Too many players, try again later."
      });
    } else {
      var computerSocket = clientManager.getSocket(uidToConnectTo);
      // addPlayer will initialize the player accordingly.
      game.addPlayer(uid, socket, computerSocket);
      socket.emit("link-devices-response", {
        success: true,
        message: "Successfully linked. Joining game."
      });
    }
  });

  socket.on(Constants.ACCELEROMETER_DATA_SOCKET_TAG, function(data) {
    console.log(data);
  });

  // When a player disconnects, remove them from the game.
  socket.on("disconnect", function() {
    clientManager.remove(clientManager.getUid(socket));
    game.attemptRemovePlayer(socket);
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  game.sendStateToClients();
}, FRAME_RATE);

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log("STARTING SERVER ON PORT " + PORT_NUMBER);
  if (DEV_MODE) {
    console.log("DEVELOPMENT MODE ENABLED");
  }
});
