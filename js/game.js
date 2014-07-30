(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'baby-tanks');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
'use strict';

var Bullet = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bullet', frame);
  this.name = "bullet";
  
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);

  // set the time to live
  game.time.events.add(Phaser.Timer.SECOND * 3, this.destroy, this);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  this.rotation = Math.atan(this.body.velocity.y / this.body.velocity.x);
  if ((!this.inWorld && this.world.y > this.game.height))
    this.destroy();
};

Bullet.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = Bullet;

},{}],3:[function(require,module,exports){
'use strict';

var Crosshair = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);

  this.anchor.setTo(0.5, 0.5);
  
  this.game.physics.p2.enableBody(this);
  this.body.data.gravityScale = 0;
  this.body.angularVelocity = 2;
  this.body.angularDamping = 0;
  this.body.setCollisionGroup([]);
  this.angularAcceleration = 8; // per second
  this.defaultAngularVelocity = 2;
  this.charging = false;
};

Crosshair.prototype = Object.create(Phaser.Sprite.prototype);
Crosshair.prototype.constructor = Crosshair;

Crosshair.prototype.update = function() {
  
  this.body.x = this.game.input.mousePointer.worldX;
  this.body.y = this.game.input.mousePointer.worldY;

  if(this.charging)
    this.body.angularVelocity += this.angularAcceleration * (this.game.time.elapsed / 1000);

  this.angle += this.rotateSpeed * (this.game.time.elapsed / 1000);
};

Crosshair.prototype.startCharge = function() {
  this.charging = true;
}

Crosshair.prototype.stopCharge = function() {
  this.charging = false;
  this.body.angularVelocity = this.defaultAngularVelocity;
}

module.exports = Crosshair;

},{}],4:[function(require,module,exports){
'use strict';

var Enemy = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.mass = 3;
  this.health = 10;

  // Magnitude of hits required to damage this entity
  this.collissionMagnitude = 30;

  this.body.onBeginContact.add(this.checkCollision, this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
};

Enemy.prototype.decreaseHealth = function(amount, impactVelocity) {
  this.health -= amount;

  // Create the death particles
  if (this.health <= 0)
  {
    var emitter = this.game.add.emitter(this.x, this.y, 400);
    emitter.width = this.width - 50;
    emitter.height = this.height - 50;
    emitter.makeParticles('explosion');
    emitter.minParticleSpeed.set(0, 0);
    emitter.maxParticleSpeed.set(10 * impactVelocity.x * -1, 1 * impactVelocity.y);
    emitter.gravity = 300;
    emitter.setRotation(-100, 100);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 1;

    emitter.start(true, 2000, null, 50);
    this.destroy();
  }
};

Enemy.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body) {
    if(body.sprite.name == "bullet") {
      if((new Phaser.Point(body.velocity.x, body.velocity.y)).getMagnitude() > this.collissionMagnitude) {
        this.decreaseHealth(5, body.velocity);
        body.sprite.destroy();
      }
    }
  }
};


module.exports = Enemy;

},{}],5:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.p2.enable(this);

  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.data.gravityScale = 0;
  this.body.static = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;

},{}],6:[function(require,module,exports){
'use strict';

var Bullet = require('../prefabs/bullet');

var Tank = function(game, x, y, frame) {
  /** GAMEPLAY VARIABLES */

  // MOVEMENT VARIABLES
  this.acceleration = 1200; // px / second
  this.maxSpeed = 200; // px / second

  // ATTACK VARIABLES
  this.minPower = 600; // px / second
  this.maxPower = 2000; // px / second
  this.powerTime = 3000; // Time till max charge in ms
  this.cannonAngleMax = 0.4; // rad
  this.cannonAngleMin = 5.05; // rad

  /** END GAMEPLAY VARIABLES */

  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'babyTank', 1);

  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable physics
  game.physics.p2.enable(this);
  this.body.damping = 0;

  // enable controls
  this.cursors = game.input.keyboard.createCursorKeys();
  this.moveRightD = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.moveLeftA = game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.spaceBar.onDown.add(this.jump, this);
  game.input.onDown.add(this.beforeFire, this);
  game.input.onUp.add(this.fire, this);

  // add the cannon
  this.cannon = new Phaser.Sprite(game, 24, -12, 'cannon');
  this.cannon.anchor.setTo(0, 0.5);
  this.addChild(this.cannon);
  this.tankFireSound = this.game.add.audio('tankPewPew');

  // add the engine sound
  this.tankEngineSound = this.game.add.audio('tankEngine');
  this.tankEngineSound.play('', 0, 1, true);

  // add animations
  this.animations.add('moveWheels');

  // baby
  this.baby = new Phaser.Sprite(game, -40, -20, 'baby');
  this.baby.anchor.setTo(0.5, 0.5);
  this.addChild(this.baby);
};

Tank.prototype = Object.create(Phaser.Sprite.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.update = function() {
  this.updateMovement();
  this.updateCannonRotation();

  // UPDATE ANIMATION AND SOUND
  // make engine louder and animate when tank is moving
  if (this.body.velocity.x > 0.5 || this.body.velocity.x < -0.5) {
    this.tankEngineSound.volume = 0.5;
      this.animations.play('moveWheels', 10, true);
  } else {
    this.tankEngineSound.volume = 0.3;
    this.animations.stop('moveWheels');
  }
};

Tank.prototype.cursorVector = function() {
  if(this.game.crosshair == null)
    return new Phaser.Point(1, 1);

  var x = (this.game.crosshair.world.x - this.world.x);
  var y = (this.game.crosshair.world.y - this.world.y);
  var posDiff = new Phaser.Point(x, y);
  return Phaser.Point.normalize(posDiff);
};

Tank.prototype.updateMovement = function() {
  if (this.cursors.right.isDown || this.moveRightD.isDown) {
    this.scale.x = 1; // sets direction to the right
    this.body.velocity.x = (this.body.world.mpx(this.body.velocity.x) * -1) + this.acceleration * (this.game.time.elapsed / 1000); 
  } else if (this.cursors.left.isDown || this.moveLeftA.isDown) {
    this.scale.x = -1; // sets direction to the left
    this.body.velocity.x = (this.body.world.mpx(this.body.velocity.x) * -1) - this.acceleration * (this.game.time.elapsed / 1000); 
  }

  this.body.velocity.x = Phaser.Math.clamp(this.body.world.mpx(this.body.velocity.x) * -1, this.maxSpeed * -1, this.maxSpeed);
};

Tank.prototype.updateCannonRotation = function() {
    if(this.crosshair != null) {
      var newAngle = Phaser.Math.angleBetweenPoints(this.position, this.crosshair.position); // Rad
      newAngle = newAngle - this.rotation;
      newAngle = Phaser.Math.normalizeAngle(this.scale.x == 1 ? newAngle : Math.PI - newAngle);

      if(newAngle > Math.PI)
        newAngle = Phaser.Math.clamp(newAngle, this.cannonAngleMin, Math.PI * 2);
      else
        newAngle = Phaser.Math.clamp(newAngle, 0, this.cannonAngleMax);

      this.cannon.rotation = newAngle;
  }
};

Tank.prototype.getVectorCannon = function() {
  var canRotation = Phaser.Math.normalizeAngle(this.rotation + (this.scale.x == 1 ? this.cannon.rotation : Math.PI - this.cannon.rotation ));
  var x = Math.cos(canRotation) * this.cannon.width;
  var y = Math.sin(canRotation) * this.cannon.width * -1;
  return Phaser.Point.normalize(new Phaser.Point(x, y));
}

Tank.prototype.fire = function() {
  this.crosshair.stopCharge();
  var bulletVelocity = this.getVectorCannon();
  var bullet = new Bullet(this.game, this.cannon.world.x + bulletVelocity.x * this.cannon.width, this.cannon.world.y - bulletVelocity.y * this.cannon.width );
  this.game.add.existing(bullet);
  var timeElapsed = ((new Date()).getTime()) - this.startFiring;

  bulletVelocity.setMagnitude((timeElapsed / this.powerTime) * this.maxPower + this.minPower);
  bulletVelocity.x += this.body.world.mpx(this.body.velocity.x * -1);

  bullet.fire(bulletVelocity.x, -bulletVelocity.y);
  this.tankFireSound.play();
};

Tank.prototype.beforeFire = function() {
  this.firing = true;
  this.startFiring = (new Date()).getTime();
  this.crosshair.startCharge();
};

Tank.prototype.jump = function() {
  if (this.y >= 445)
    this.body.velocity.y += -400;
}

module.exports = Tank;

},{"../prefabs/bullet":2}],7:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.titleText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2, 'babyFont', 'YOU ARE THE \nBEST BABY TANK', 45);
    this.titleText.fixedToCamera = false;

    this.instructionsText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2 + 100, 'babyFont', 'Click anywhere to play BABY TANKS again', 22);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: 'red', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 200, 'baby-tank');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.bitmapText(this.game.world.centerX - 325, 200, 'babyFont', 'BABY TANKS', 72);

    this.instructionsText = this.game.add.bitmapText(this.game.world.centerX, 400, 'babyFont', 'Click anywhere to play "BABY TANKS"', 16);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 500, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // music
    this.music = this.game.add.audio('backgroundMusic', 1, true);
    this.music.play('', 0, 1, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],10:[function(require,module,exports){
'use strict';

var Ground    = require('../prefabs/ground');
var Tank      = require('../prefabs/tank');
var Crosshair = require('../prefabs/crosshair');
var Enemy     = require('../prefabs/enemy');

function Play() {}
Play.prototype = {
  create: function() {

    // Setup gravity
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1200;
    this.game.physics.p2.restitution = 0.3;
    this.game.physics.p2.friction = 0.3;
    //this.game.physics.p2.setImpactEvents(true);

    // Set up collision groups
    this.playerCG = this.game.physics.p2.createCollisionGroup();
    this.environmentCG = this.game.physics.p2.createCollisionGroup();
    this.enemyCG = this.game.physics.p2.createCollisionGroup();

    // background
    this.background = this.game.add.tileSprite(0, 0, 5000, 500, 'background');
    this.flowers = this.game.add.sprite(0, this.game.height - 120, 'flowers');

    // Create/add the ground
    this.ground = new Ground(this.game, 0, 500, 10000, 40);
    this.game.add.existing(this.ground);
    //this.ground.body.setCollisionGroup(this.groundCG);

    // Create the tank
    this.tank = new Tank(this.game, this.game.width/8, this.game.height/2);
    //this.tank.body.setCollisionGroup(this.entityCG);
    this.game.add.existing(this.tank);

    // Create the crosshair
    this.crosshair = new Crosshair(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.crosshair);
    this.tank.crosshair = this.crosshair;

    // Create/add a enemy
    this.enemy = new Enemy(this.game, 600, 300);
    this.game.add.existing(this.enemy);

    // Camera
    this.game.camera.follow(this.tank, Phaser.Camera.FOLLOW_PLATFORMER);

    // World bounds
    this.game.world.setBounds(0, 0, 5000, 500);

    // Capture the spacebar key so the page doesn't scroll
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
  },
  update: function() {
    if(this.tank.world.x > 4500)
      this.game.state.start('gameover');
  }
};

module.exports = Play;

},{"../prefabs/crosshair":3,"../prefabs/enemy":4,"../prefabs/ground":5,"../prefabs/tank":6}],11:[function(require,module,exports){
'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('flowers', 'assets/flowers.png');
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('baby-tank', 'assets/baby-tank.jpg');
    this.load.spritesheet('bigTank', 'assets/bigtank_sheet.png', 100, 80, 2);
    this.load.spritesheet('babyTank', 'assets/babytank_sheet.png', 100, 64, 2);
    this.load.image('baby', 'assets/baby.png');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('enemy', 'assets/yoman.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('cannon', 'assets/cannon.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('explosion', 'assets/explosion_sheet.png', 12, 12, 3);

    this.load.bitmapFont('babyFont', 'assets/fonts/babyFont/font.png', 'assets/fonts/babyFont/font.fnt');
    this.load.audio('backgroundMusic', 'assets/music.wav');
    this.load.audio('tankPewPew', 'assets/tank_pewpew.mp3');
    this.load.audio('tankEngine', 'assets/tank_enginesound.mp3');
    this.load.audio('bulletSplode', 'assets/bullet_splosion.mp3');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])