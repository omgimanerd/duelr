/**
 * This client side class encapsulates the game and handles the interaction
 * between the various objects in the world.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @todo Document the fucking shit out of everything.
 */

/**
 * @constructor
 * @param {Element} container The container element for the game.
 */
function Game(socket, container, scene, map, renderer, uiCanvas, self) {
  this.container = container;
  this.socket = socket;

  /**
   * The render() method is called with the scene and camera as parameters
   * on the renderer object to draw the 3D scene.
   */
  this.scene = scene;
  this.drawing = new Drawing(scene, uiCanvas);
  this.drawing.setMap(map);

  this.renderer = renderer;
  this.renderer.setSize(Game.WIDTH, Game.HEIGHT);
  // @todo prepend renderer to container so that uiCanvas can be overlaid.
  this.container.appendChild(this.renderer.domElement);
  this.uiCanvas = uiCanvas;
  this.container.appendChild(this.uiCanvas);

  this.self = self;
  this.players = [];
  this.projectiles = [];
}

Game.WIDTH = 800;
Game.HEIGHT = 600;

Game.create = function(socket, parentElement, position, map) {
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();
  var uiCanvas = document.createElement('canvas');
  uiCanvas.width = 800;
  uiCanvas.height = 600;
  var player = Player.create(position);
  return new Game(socket, parentElement, scene, map,
                  renderer, uiCanvas, player);
};

Game.prototype.update = function() {

  // Having the mouse locked will allow play. No packets should be sent
  // if the user's mouse is not locked. The game should only update if
  // the user's mouse is locked.
  if (Input.MOUSE_LOCKED) {
    document.getElementById('game-pause-screen').style.display = 'none';

    this.self.updateFromClient();
    this.socket.emit('client-intent', {
      keyboardState: {
        up: Input.UP,
        down: Input.DOWN,
        left: Input.LEFT,
        right: Input.RIGHT,
        space: Input.SPACE
      },
      isShooting: Input.LEFT_CLICK,
      horizontalLookAngle: this.self.horizontalLookAngle,
      verticalLookAngle: this.self.verticalLookAngle,
      timestamp: (new Date()).getTime()
    });
  } else {
    document.getElementById('game-pause-screen').style.display = 'block';
  }
};

Game.prototype.receiveGameState = function(self, players, projectiles) {
  this.self.updateFromServer(self.position, self.health);
  this.players = players;
  this.projectiles = projectiles;
};

Game.prototype.render = function() {
  this.renderer.render(this.scene, this.self.camera);
  this.drawing.redrawPlayers(this.players);
  this.drawing.redrawProjectiles(this.projectiles);
  this.drawing.redrawUI(this.self.health);
};
