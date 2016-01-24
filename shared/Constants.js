/**
 * This class stores global constants for this project, and is available to the
 * client as well as the server modules.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

/**
 * Empty constructor for the Constants class.
 * @constructor
 */
function Constants() {
  throw new Error("Constants should not be instantiated!");
}

Constants.ACCELEROMETER_DATA_SOCKET_TAG = "accel_data";

Constants.SERVER_TO_CLIENT_SOCKET_TAG = "server_to_client_socket_tag";

Constants.TAU = 2 * Math.PI;

Constants.MOBILE = "mobile";

Constants.COMPUTER = "computer";

Constants.SWORD_LENGTH = 7.5;

try {
  module.exports = Constants;
} catch (err) {}
