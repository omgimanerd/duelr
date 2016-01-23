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
  throw new Error('Constants should not be instantiated!');
}

try {
  module.exports = Constants;
} catch (err) {}
