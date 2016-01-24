/**
 * Player class to manage the player state on the server.
 */

var Constants = require("../shared/Util");

function Player(phoneUid, phoneSocket, computerSocket,
                swordOrigin, swordHeading, swordLength) {
  this.phoneUid = phoneUid;
  this.phoneSocket = phoneSocket;
  this.computerSocket = computerSocket;

  this.swordOrigin = swordOrigin;
  this.swordHeading = swordHeading;
  this.swordLength = swordLength;

  this.lastUpdateTime = 0;
}

Player.DEFAULT_HEADING = [0, 1, 0];

Player.create = function(phoneUid, phoneSocket, computerSocket, swordOrigin) {
  return new Player(phoneUid, phoneSocket, computerSocket, swordOrigin,
                    Player.DEFAULT_HEADING, Constants.SWORD_LENGTH);
};

Player.prototype.init = function() {
  var context = this;
  this.phoneSocket.on("accel_data", function(data) {
    console.log(data);
    context.update(data.orientation);
    console.log(data);
  });
};

Player.prototype.update = function(orientation) {
  this.swordHeading = [
    orientation.x,
    orientation.y,
    orientation.z
  ];
};

Player.prototype.hasConnectedSocket = function(socket) {
  return this.phoneSocket == socket || this.computerSocket == socket;
};

Player.prototype.getComputerSocket = function() {
  return this.computerSocket;
};

module.exports = Player;
