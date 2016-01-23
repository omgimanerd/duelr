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

ClientManager.prototype.remove = function(uid) {
  this.sockets.remove(uid);
  this.deviceTypes.remove(uid);
};

ClientManager.prototype.isPairable = function(uid1, uid2) {
  return this.getDeviceType(uid1) == Constants.MOBILE &&
    this.getDeviceType(uid2) == Constants.COMPUTER;
};

//
//ClientManager.prototype.addPhone = function(socket) {
//  var uid = this.generateUID();
//  this.phones.set(uid, {
//    socket: socket,
//    paired_computer: null
//  });
//  return uid;
//};
//
//ClientManager.prototype.addComputer = function(socket) {
//  var uid = this.generateUID();
//  this.computers.set(uid, {
//    socket: socket,
//    paired_phone: null
//  });
//  return uid;
//};
//
//ClientManager.prototype.removePhone = function(uid) {
//  if (this.phones.has(uid)) {
//    var phone = this.phones.get(uid);
//    this.computers.remove(phone.paired_computer);
//    this.phones.remove(uid);
//  }
//};
//
//ClientManager.prototype.removeComputer = function(uid) {
//  if (this.computers.has(uid)) {
//    var computer = this.computers.get(uid);
//    this.phones.remove(computer.paired_phone);
//    this.computers.remove(uid);
//  }
//};
//
//ClientManager.prototype.removeSocket = function(socket) {
//  var phones = this.phones.keys();
//  var computers = this.computers.keys();
//  for (var i = 0; i < phones.length; ++i) {
//    if (this.phones.get(phones[i]).socket == socket ||
//        this.phones.get(phones[i]).paired_computer == socket) {
//      this.phones.remove(phones[i]);
//      break;
//    }
//  }
//  for (var i = 0; i < computers.length; ++i) {
//    if (this.computers.get(computers[i]).socket == socket ||
//        this.computers.get(computers[i]).paired_phone == socket) {
//      this.computers.remove(computers[i]);
//      break;
//    }
//  }
//};
//
//ClientManager.prototype.getPhone = function(uid) {
//  return this.phones.get(uid);
//};
//
//ClientManager.prototype.getComputer = function(uid) {
//  return this.computers.get(uid);
//};
//
//ClientManager.prototype.hasOpenConnection = function(deviceType) {
//  if (deviceType == "phone") {
//    return this.phones.values().length < 2;
//  }
//  return this.computers.values().length < 2;
//};
//
//ClientManager.prototype.canStartGame = function() {
//  return this.phones.values().length == 2 &&
//      this.computers.values().length == 2;
//};
//
//ClientManager.prototype.linkClients = function(phoneDeviceUid,
//                                               computerDeviceUid) {
//  var phone = this.phones.get(phoneDeviceUid);
//  phone.paired_computer = computerDeviceUid;
//  this.phones.set(phoneDeviceUid, phone);
//
//  var computer = this.computers.get(computerDeviceUid);
//  computer.paired_phone = phoneDeviceUid;
//  this.computers.set(computerDeviceUid, computer);
//};

module.exports = ClientManager;
