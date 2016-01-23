/**
 * Player class to manage the player state on the server.
 */

function Player(phoneSocket, computerSocket) {
  this.phoneSocket = phoneSocket;
  this.computerSocket = computerSocket;
}

Player.prototype.hasConnectedSocket = function(socket) {
  return this.phoneSocket == socket || this.computerSocket == socket;
};

module.exports = Player;
