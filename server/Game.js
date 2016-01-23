/**
 * Game class on the server to manage the state of players in games.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require("hashmap");

var Player = require("./Player");

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects in the game.
 * @constructor
 */
function Game(player1, player2) {
  this.player1 = null;
  this.player2 = null;
}

Game.create = function() {
  return new Game(null, null);
};

Game.prototype.isFull = function() {
  return this.player1 != null && this.player2 != null;
};

Game.prototype.hasConnectedSocket = function(socket) {
  return this.player1.hasConnectedSocket(socket) ||
    this.player2.hasConnectedSocket(socket);
};

/**
 */
Game.prototype.attemptRemovePlayer = function(socket) {
  if (this.player1.hasConnectedSocket(socket)) {
    this.player1 = null;
  } else if (this.player2.hasConnectedSocket(socket)) {
    this.player2 = null;
  }
};

/**
 * Updates the player with the given ID according to the input state sent by
 * that player's client.
 */
Game.prototype.updatePlayer = function(id) {
};

/**
 * Updates the states of all the players in all active games.
 */
Game.prototype.update = function() {
};

module.exports = Game;
