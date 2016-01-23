/**
 * Player class to manage the player state on the server.
 */

function Player(phoneSocket, computerSocket) {
  this.phoneSocket = phoneSocket;
  this.computerSocket = computerSocket;
}

module.exports = Player;
