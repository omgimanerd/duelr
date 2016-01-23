/**
 * This is a utility class containing utility methods used on the server and
 * client.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

try {
  var Constants = require('./Constants');
} catch (err) {}

/**
 * Empty constructor for the Util class, all functions will be static.
 * @constructor
 */
function Util() {
  throw new Error('Util should not be instantiated!');
};

/**
 * Generates and returns a UID.
 * @param {?number=} length An optional length parameter for the UID to
 *   to generate. If the length is not provided, this function will return a
 *   UID of length 32.
 */
Util.generateUID = function(length) {
  if (!length) {
    length = 32;
  }
  var choice = 'abcdefghijklmnopqrstuvwxyz' +
               'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               '1234567890';
  var uid = '';
  for (var i = 0; i < length; ++i) {
    uid += choice.charAt(Math.floor(Math.random() * choice.length));
  }
  return uid;
};

/**
 * Returns the Manhattan Distance between two points given their x and y
 * coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getManhattanDistance = function(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

/**
 * Returns the squared Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance2 = function(x1, y1, x2, y2) {
  return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
};

/**
 * Returns the true Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(Util.getEuclideanDistance2(x1, y1, x2, y2));
};

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
Util.inBound = function(val, min, max) {
  if (min > max) {
    return val >= max && val <= min;
  }
  return val >= min && val <= max;
};

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
Util.bound = function(val, min, max) {
  if (min > max) {
    return Math.min(Math.max(val, max), min);
  }
  return Math.min(Math.max(val, min), max);
};

/**
 * Returns true if the given point is in the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y The y-coordinate of the given point.
 * @return {boolean}
 */
Util.inWorld = function(x, y) {
  return Util.inBound(x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(y, Constants.WORLD_MIN, Constants.WORLD_MAX);
};

/**
 * Bounds a coordinate if it is outside of the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y The y-coordinate of the given point.
 * @return {[number, number]}
 */
Util.boundWorld = function(x, y) {
  return [Util.bound(x, Constants.WORLD_MIN, Constants.WORLD_MAX),
          Util.bound(y, Constants.WORLD_MIN, Constants.WORLD_MAX)];
};

/**
 * Returns a random point inside the game environment world.
 * @param {number=} padding Optional argument specifying how much
 *   padding from the edge of the world this function should apply.
 *   Defaults to 30;
 * @return {[number, number]}
 */
Util.getRandomWorldPoint = function(padding) {
  if (!padding) {
    padding = Constants.WORLD_PADDING;
  }
  return [Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding),
          Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding)];
};

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 */
Util.randRange = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 */
Util.randRangeInt = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random element in a given array.
 * @param {Array.<Object>} array The array from which to select a random
 *   element from.
 * @return {Object}
 */
Util.choiceArray = function(array) {
  return array[Util.randRangeInt(0, array.length)];
};

try {
  module.exports = Util;
} catch (err) {}


Util.dot = function(x1,y1,z1,x2,y2,z2){
  return (x1 * x2 + y1 * y2 + z1 * z2);
}

Util.getDistanceOfTwoLinesin3D = function(x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4) {
  var EPS = 0.00000001;

  var delta21x = x2 - x1;
  var delta21y = y2 - y1;
  var delta21z = z2 - z1;

  var delta43x = x4 - x3;
  var delta43y = y4 - y3;
  var delta43z = z4 - z3;

  var delta13x = x1 - x3;
  var delta13y = y1 - y3;
  var delta13z = z1 - z3;

  var a = Util.dot(delta21x, delta21y, delta21z, delta21x, delta21y, delta21z);
  var b = Util.dot(delta21x, delta21y, delta21z, delta43x, delta43y, delta43z);
  var c = Util.dot(delta43x, delta43y, delta43z, delta43x, delta43y, delta43z);
  var d = Util.dot(delta21x, delta21y, delta21z, delta13x, delta13y, delta13z);
  var e = Util.dot(delta43x, delta43y, delta43z, delta13x, delta13y, delta13z);
  var D = a * c - b * b;

  var sc, sN, sD = D;
  var tc, tN, tD = D;

  if (D < EPS) {
    sN = 0.0;
    sD = 1.0;
    tN = e;
    tD = c;
  } else {
    sN = (b * e - c * d);
    tN = (a * e - b * d);
    if (sN < 0.0) {
      sN = 0.0;
      tN = e;
      tD = c;
    } else if (sN > sD) {
      sN = sD;
      tN = e + b;
      tD = c;
    }
  }
 
  if (tN < 0.0) {
    tN = 0.0;
    if (-d < 0.0){
      sN = 0.0;
    } else if (-d > a){
      sN = sD;
    } else {
      sN = -d;
      sD = a;
    }
  }
  else if (tN > tD) {
    tN = tD;
    if ((-d + b) < 0.0) {
      sN = 0;
    } else if ((-d + b) > a) {
      sN = sD;
    } else {
      sN = (-d + b);
      sD = a;
    }
  }

  if (Math.abs(sN) < EPS) { 
    sc = 0.0;
  } else {
    sc = sN / sD;
  }

  if (Math.abs(tN) < EPS) {
    tc = 0.0;
  } else {
    tc = tN / tD;
  }

  var dPx = delta13x + (sc * delta21x) - (tc * delta43x);
  var dPy = delta13y + (sc * delta21y) - (tc * delta43y);
  var dPz = delta13z + (sc * delta21z) - (tc * delta43z);
 
  return Math.sqrt(Util.dot(dPx, dPy, dPz, dPx, dPy, dPz));
}
