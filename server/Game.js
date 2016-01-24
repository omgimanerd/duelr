/**
 * Game class on the server to manage the state of players in games.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require("hashmap");

var Constants = require("../shared/Constants");
var Player = require("./Player");

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects in the game.
 * @constructor
 */
function Game(player1, player2, player1ComputerSocket, player2ComputerSocket) {
  this.player1 = player1;
  this.player2 = player2;
}

Game.PLAYER1_ORIGIN = [-5, 0, 0];
Game.PLAYER2_ORIGIN = [5, 0, 0];

Game.create = function() {
  return new Game(null, null);
};

Game.prototype.isFull = function() {
  return this.player1 != null && this.player2 != null;
};

Game.prototype.addPlayer = function(phoneUid, phoneSocket,
                                    computerUid, computerSocket) {
  if (this.isFull()) {
    throw new Exception("Game is full! Someone fucked up!");
  }
  if (this.player1) {
    this.player2 = Player.create(phoneUid, phoneSocket,
                                 computerUid, computerSocket,
                                 Game.PLAYER2_ORIGIN);
    this.player2.init();
  } else {
    this.player1 = Player.create(phoneUid, phoneSocket,
                                 computerUid, computerSocket,
                                 Game.PLAYER1_ORIGIN);
    this.player1.init();
  }
};

Game.prototype.matchSocketToPlayer = function(socket) {
  if (this.player1.hasConnectedSocket(socket)) {
    return this.player1;
  } else if (this.player2.hasConnected(socket)) {
    return this.player2;
  }
  return null;
};

/**
 */
Game.prototype.attemptRemovePlayer = function(socket) {
  if (this.player1 && this.player1.hasConnectedSocket(socket)) {
    this.player1 = null;
  } else if (this.player2 && this.player2.hasConnectedSocket(socket)) {
    this.player2 = null;
  }
};

/**
 * Updates the states of all the players in all active games.
 */
Game.prototype.update = function() {
};

Game.prototype.sendStateToClients = function() {
  var payload = {};
  if (this.player1) {
    payload[this.player1.computerUid] = {
      swordOrigin: this.player1.swordOrigin,
      swordHeading: this.player1.swordHeading,
      swordLength: this.player1.swordLength
    }
  }
  if (this.player2) {
    payload[this.player2.computerUid] = {
      swordOrigin: this.player2.swordOrigin,
      swordHeading: this.player2.swordHeading,
      swordLength: this.player2.swordLength
    }
  }

  if (this.player1) {
    this.player1.getComputerSocket().emit("server_update",
                                          payload);
  }
  if (this.player2) {
    this.player2.getComputerSocket().emit("server_update",
                                          payload);
  }
};

module.exports = Game;
