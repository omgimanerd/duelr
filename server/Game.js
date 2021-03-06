/**
 * Game class on the server to manage the state of players in games.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require("hashmap");

var Constants = require("../shared/Constants");
var Player = require("./Player");

var normalize = require("vectors/normalize")(2);

/**
 * Constructor for the server side Game class.
 * Instantiates the data structures to track all the objects in the game.
 * @constructor
 */
function Game(player1, player2, player1ComputerSocket, player2ComputerSocket) {
  this.player1 = player1;
  this.player2 = player2;
}

Game.PLAYER1_ORIGIN = {
  x: -150,
  y: -100,
  z: 0
};
Game.PLAYER2_ORIGIN = {
  x: 150,
  y: -100,
  z: 0
};

Game.create = function() {
  return new Game(null, null);
};

Game.prototype.isFull = function() {
  return this.player1 !== null && this.player2 !== null;
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
Game.prototype.collisionOccurred = function() {
  var p1Mag = [this.player1.swordRateOfChange.x,
               this.player1.swordRateOfChange.y,
               this.player1.swordRateOfChange.z];
  var p2Mag = [this.player2.swordRateOfChange.x,
               this.player2.swordRateOfChange.y,
               this.player2.swordRateOfChange.z];
  if (p1Mag > p2Mag) {
    this.player1.loseControl(this.player2.swordRateOfChange);
  } else {
    this.player2.loseControl(this.player1.swordRateOfChange);
  }
};

Game.prototype.sendStateToClients = function() {
  var payload = {};
  if (this.player1) {
    payload.player1 = {
      uid: this.player1.computerUid,
      swordOrigin: this.player1.swordOrigin,
      swordHeading: this.player1.swordHeading,
      swordLength: this.player1.swordLength
    };
  }
  if (this.player2) {
    payload.player2 = {
      uid: this.player2.computerUid,
      swordOrigin: this.player2.swordOrigin,
      swordHeading: this.player2.swordHeading,
      swordLength: this.player2.swordLength
    };
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
