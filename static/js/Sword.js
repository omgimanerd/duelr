/**
 * @constructor
 */
function Sword(camera, position, lookPosition) {
  this.camera = camera;

  this.position = position;
  this.virtualMousePosition = [0, 0];
  this.horizontalLookAngle = 0;
  this.verticalLookAngle = 0;
  this.lookPosition = lookPosition;

  this.health = 0;
}

Sword.CAMERA_FIELD_OF_VIEW = 70;

Sword.CAMERA_ASPECT_RATIO = 800 / 600;

Sword.CAMERA_NEAR_CLIPPING_PLANE = 0.1;

Sword.CAMERA_FAR_CLIPPING_PLANE = 1000;

Sword.create = function(position) {
  var camera = new THREE.PerspectiveCamera(
      Sword.CAMERA_FIELD_OF_VIEW, Sword.CAMERA_ASPECT_RATIO,
      Sword.CAMERA_NEAR_CLIPPING_PLANE, Sword.CAMERA_FAR_CLIPPING_PLANE);
  var position = new THREE.Vector3(position[0],
                                   position[1],
                                   position[2]);
  var lookPosition = new THREE.Vector3(0, 0, 0);
  return new Sword(camera, position, lookPosition);
};

Sword.prototype.updateFromClient = function() {
  this.position.copy(this.camera.position);

  // We maintain a "virtual mouse position" since the mouse is locked.
  // The virtual mouse position is bounded to the width and height of the
  // canvas and maintained here.
  for (var i = 0; i < Input.RECENT_MOUSE_MOVEMENTS.length; ++i) {
    this.virtualMousePosition[0] += Input.RECENT_MOUSE_MOVEMENTS[i][0];
    this.virtualMousePosition[1] += Input.RECENT_MOUSE_MOVEMENTS[i][1];
  }
  // Clear the array of recent mouse movements after they have been processed.
  Input.RECENT_MOUSE_MOVEMENTS = [];
  while (this.virtualMousePosition[0] < 0) {
    this.virtualMousePosition[0] += Game.WIDTH;
  }
  this.virtualMousePosition[0] %= Game.WIDTH;
  this.virtualMousePosition[1] = Math.min(Math.max(
      this.virtualMousePosition[1], 0), Game.HEIGHT);

  // The virtual mouse position is mapped to two angles which describe a point
  // on a 3D sphere around the Sword that we can set the camera to look at.
  this.horizontalLookAngle = Util.linearScale(this.virtualMousePosition[0],
                                              0, Game.WIDTH,
                                              0, 2 * Math.PI);
  this.verticalLookAngle = Util.linearScale(this.virtualMousePosition[1],
                                            0, Game.HEIGHT,
                                            Math.PI / 18,
                                            Math.PI - Math.PI / 18);

  // The Sword's look position is updated here by calculating the point on the
  // sphere that the horizontal and vertical look angles describe.
  this.lookPosition.setX(this.position.x +
      5 * Math.sin(this.verticalLookAngle) *
      Math.cos(this.horizontalLookAngle));
  this.lookPosition.setY(this.position.y +
      5 * Math.cos(this.verticalLookAngle));
  this.lookPosition.setZ(this.position.z +
      5 * Math.sin(this.verticalLookAngle) *
      Math.sin(this.horizontalLookAngle));
  this.camera.lookAt(this.lookPosition);
};

Sword.prototype.updateFromServer = function(position, health) {
  this.camera.position.setX(position[0]);
  this.camera.position.setY(position[1]);
  this.camera.position.setZ(position[2]);
  this.health = health;
};
