/**
 * ClientManager class to manage all connected sockets.
 */

var HashMap = require("hashmap");

var Constants = require("../shared/Constants");
var Util = require("../shared/Util");

/**
 * Constructor for the server side ClientManager class.
 * @constructor
 */
function ClientManager() {
//  this.phones = new HashMap();
//  this.computers = new HashMap();
  this.sockets = new HashMap();
  this.deviceTypes = new HashMap();
}

ClientManager.UID_LENGTH = 6;

ClientManager.create = function() {
  return new ClientManager();
};

ClientManager.prototype.generateUID = function() {
  var uid = Util.generateUID(ClientManager.UID_LENGTH);
  while (this.clients.has(uid)) {
    uid = Util.generateUID(ClientManager.UID_LENGTH);
  }
  return uid;
};

ClientManager.prototype.addClient = function(socket, deviceType) {
  var uid = this.generateUID();
  this.sockets.set(uid, socket);
  this.deviceTypes.set(uid, deviceType);
};

ClientManager.prototype.getSocket = function(uid) {
  return this.sockets.get(uid);
};

ClientManager.prototype.getUid = function(socket) {
  return this.sockets.search(socket);
};

ClientManager.prototype.getDeviceType = function(uid) {
  return this.deviceTypes.get(uid);
};

ClientManager.prototype.isPairable = function(uid1, uid2) {
  return this.getDeviceType(uid1) == Constants.MOBILE &&
    this.getDeviceType(uid2) == Constants.COMPUTER;
};

ClientManager.prototype.remove = function(uid) {
  this.sockets.remove(uid);
  this.deviceTypes.remove(uid);
};

module.exports = ClientManager;
