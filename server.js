/**
 * This is the app script that is run on the server.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @todo Add unit tests!
 */

var DEV_MODE = false;
var FRAME_RATE = 1000.0 / 60.0;
var IP = process.env.IP || 'localhost';
var PORT_NUMBER = process.env.PORT || 5000;

process.argv.forEach(function(value, index, array) {
  if (value == '--dev' || value == '-dev' ||
      value == '--development' || value == '-development') {
    DEV_MODE = true;
  }
});

// Dependencies.
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');
var swig = require('swig');

// Initialization.
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
app.use('/static',
        express.static(__dirname + '/static'));
app.use('/shared',
        express.static(__dirname + '/shared'));

// Routing
app.get('/', function(request, response) {
  response.render('index.html', {
    dev_mode: DEV_MODE
  });
});

// Server side input handler, modifies the state of the players and the
// game based on the input it receives. Everything runs asynchronously with
// the game loop.
io.on('connection', function(socket) {
  // When a new player joins, the server adds a new player to the game.
  socket.on('new-player', function(data) {
    game.addNewPlayer(data.name, socket);
 });

  // Update the internal object states every time a player sends an intent
  // packet.
  socket.on('player-action', function(data) {
    game.updatePlayerOnInput();
  });

  // When a player disconnects, remove them from the game.
  socket.on('disconnect', function() {
    var name = game.removePlayer(socket.id);
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
}, FRAME_RATE);

// Starts the server.
server.listen(PORT_NUMBER, function() {
  console.log('Starting server on port ' + PORT_NUMBER);
  if (DEV_MODE) {
    console.log('DEVELOPMENT MODE ENABLED');
  }
});
