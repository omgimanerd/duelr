/**
 * ClientManager class to manage and store all connected sockets. This class
 * will assign UIDs to each socket and store the device type associated with
 * the socket.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var HashMap = require("hashmap");

var Constants = require("../shared/Constants");
var Util = require("../shared/Util");

/**
 * Constructor for the server side ClientManager class.
 * @constructor
 */
function ClientManager() {
  this.sockets = new HashMap();
  this.deviceTypes = new HashMap();
}

/**
 * The length of the UID to generate for each connected socket.
 */
ClientManager.UID_LENGTH = 4;

/**
 * Factory method for a ClientManager class.
 * @return {ClientManager}
 */
ClientManager.create = function() {
  return new ClientManager();
};

/**
 * This method returns a UID after checking for any collisions against
 * all currently entered UIDs.
 * @return {string}
 */
ClientManager.prototype.generateUID = function() {
  var uid = Util.generateUID(ClientManager.UID_LENGTH);
  while (this.sockets.has(uid)) {
    uid = Util.generateUID(ClientManager.UID_LENGTH);
  }
  return uid;
};

/**
 * Given a socket and the device type of the socket, this method generates a
 * UID for the socket and stores the socket and device type.
 * @param {Socket} socket The socket to store.
 * @param {string} deviceType The device type of the socket, matches either
 *   Constants.MOBILE or Constants.COMPUTER.
 */
ClientManager.prototype.addClient = function(socket, deviceType) {
  var uid = this.generateUID();
  this.sockets.set(uid, socket);
  this.deviceTypes.set(uid, deviceType);
  return uid;
};

/**
 * Given a UID, this method returns the socket assocated with that UID.
 * @param {string} uid The UID to query.
 * @return {Socket}
 */
ClientManager.prototype.getSocket = function(uid) {
  return this.sockets.get(uid);
};

/**
 * Given a socket, this method returns the UID associated with that socket.
 * @param {Socket} socket The socket to query.
 * @return {string}
 */
ClientManager.prototype.getUid = function(socket) {
  return this.sockets.search(socket);
};

/**
 * Given a UID, this method returns device type of the socket assocated with
 * that UID.
 * @param {string} uid The UID to query.
 * @return {string}
 */
ClientManager.prototype.getDeviceType = function(uid) {
  return this.deviceTypes.get(uid);
};

/**
 * Given two UIDs, this method returns True if the first is associated with a
 * mobile device and the second is associated with a computer.
 * @param {string} uid1 The UID that should be a mobile device.
 * @param {string} uid2 The UID that should be a computer.
 * @return {boolean}
 */
ClientManager.prototype.isPairable = function(uid1, uid2) {
  return this.getDeviceType(uid1) == Constants.MOBILE &&
    this.getDeviceType(uid2) == Constants.COMPUTER;
};

/**
 * Given a UID, this method removes it and its associated socket from the
 * internal class storage and returns the removed socket.
 * @param {string} uid The UID to remove.
 */
ClientManager.prototype.remove = function(uid) {
  this.deviceTypes.remove(uid);
  return this.sockets.remove(uid);
};

module.exports = ClientManager;
