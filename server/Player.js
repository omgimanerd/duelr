/**
 * Player class to manage the player state on the server.
 */

var Constants = require("../shared/Util");

function Player(phoneUid, phoneSocket,
                computerUid, computerSocket,
                swordOrigin, swordHeading, swordLength) {
  this.phoneUid = phoneUid;
  this.phoneSocket = phoneSocket;
  this.computerUid = computerUid;
  this.computerSocket = computerSocket;

  this.swordOrigin = swordOrigin;
  this.swordHeading = swordHeading;
  this.swordLength = swordLength;
  this.swordRateOfChange = {
    x: 0,
    y: 0,
    z: 0
  };
  this.lostControl = false;
  this.lostControlRateOfChange = {
    x: 0,
    y: 0,
    z: 0
  };

  this.lastUpdateTime = (new Date()).getTime();
  this.lastLostControlTime = 0;
}

Player.REGAIN_CONTROL_TIME = 1000;

Player.DEFAULT_HEADING = {
  x: 0,
  y: 0,
  z: 0
};

Player.create = function(phoneUid, phoneSocket,
                         computerUid, computerSocket,
                         swordOrigin) {
  return new Player(phoneUid, phoneSocket, computerUid, computerSocket,
                    swordOrigin,
                    Player.DEFAULT_HEADING, Constants.SWORD_LENGTH);
};

Player.prototype.init = function() {
  var context = this;
  this.phoneSocket.on("accel_data", function(data) {
    context.update(data.orientation);
  });
};

Player.prototype.update = function(orientation) {
  var currentTime = (new Date()).getTime();
  var updateTimeDifference = currentTime - this.lastUpdateTime;
  this.lastUpdateTime = currentTime;
  this.swordRateOfChange = {
    x: (orientation.x - this.swordHeading.x) / updateTimeDifference,
    y: (orientation.y - this.swordHeading.y) / updateTimeDifference,
    z: (orientation.z - this.swordHeading.z) / updateTimeDifference
  };
  if (this.lostControl) {
    this.swordHeading.x -= this.lostControlRateOfChange.x;
    this.swordHeading.y -= this.lostControlRateOfChange.y;
    this.swordHeading.z -= this.lostControlRateOfChange.z;
  } else {
    this.swordHeading = {
      x: orientation.x,
      y: orientation.y,
      z: orientation.z
    };
  }
  this.lostControl = currentTime < this.lastLostControlTime +
      Player.REGAIN_CONTROL_TIME;
};

Player.prototype.loseControl = function(lostControlRateOfChange) {
  this.lastLostControlTime = (new Date()).getTime();
  this.lostControl = true;
  this.lostControlRateOfChange = lostControlRateOfChange;
};

Player.prototype.hasConnectedSocket = function(socket) {
  return this.phoneSocket == socket || this.computerSocket == socket;
};

Player.prototype.getComputerSocket = function() {
  return this.computerSocket;
};

module.exports = Player;
