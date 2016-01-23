/**
 * ClientManager class to manage phones and connected computers.
 */

var HashMap = require("hashmap");

var Util = require("../shared/Util");

/**
 * Constructor for the server side ClientManager class.
 * @constructor
 */
function ClientManager() {
  this.phones = new HashMap();
  this.computers = new HashMap();

  this.linkedClients = new HashMap();
}

ClientManager.UID_LENGTH = 6;

ClientManager.prototype.generateUID = function() {
  var uid = Util.generateUID(ClientManager.UID_LENGTH);
  while (this.phones.has(uid) || this.computers.has(uid)) {
    uid = Util.generateUID(ClientManager.UID_LENGTH);
  }
  return uid;
};

ClientManager.prototype.addPhone = function(socket) {
  var uid = this.generateUID();
  this.phones.set(uid, {
    socket: socket,
    paired_computer: null
  });
};

ClientManager.prototype.addComputer = function(socket) {
  var uid = this.generateUID();
  this.computers.set(uid, {
    socket: socket,
    paired_phone: null
  });
};

ClientManager.prototype.removePhone = function(uid) {
  if (this.phones.has(uid)) {
    this.phones.remove(uid);
  }
};

ClientManager.prototype.getPhone = function(uid) {
  return this.phones.get(uid);
};

ClientManager.prototype.getComputer = function(uid) {
  return this.computers.get(uid);
};


ClientManager.prototype.linkClients = function(phoneDeviceUid,
                                               computerDeviceUid) {
  var phone = this.phones.get(phoneDeviceUid);
  phone.paired_computer = computerDeviceUid;
  this.phones.set(phoneDeviceUid, phone);

  var computer = this.computers.get(computerDeviceUid);
  computer.paired_phone = phoneDeviceUid;
  this.computers.set(computerDeviceUid, computer);
};

module.exports = ClientManager;
