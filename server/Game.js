/**
 * Game class on the server to manage the state of players in games.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require("hashmap");

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects in the game.
 * @constructor
 */
function Game(player1, player2) {
  this.player1 = null;
  this.player2 = null;
}

Game.prototype.isFull = function() {
  return this.player1 != null && this.player2 != null;
};

/**
 * Removes the player with the given socket Id.
 * @param {string} The socket ID of the player to remove.
 */
Game.prototype.removePlayer = function(id) {
  if (this.clients.has(id)) {
    this.clients.remove(id);
  }
  if (this.players.has(id)) {
    var player = this.players.get(id);
    this.players.remove(id);
  }
};

/**
 * Updates the player with the given ID according to the input state sent by
 * that player's client.
 */
Game.prototype.updatePlayer = function(id) {
};

/**
 * Returns an array of the currently connected players.
 * @return {Array.<Player>}
 */
Game.prototype.getPlayers = function() {
};

/**
 * Updates the states of all the players in all active games.
 */
Game.prototype.update = function() {
};
