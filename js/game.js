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
},{"./states/boot":8,"./states/gameover":9,"./states/menu":10,"./states/play":11,"./states/preload":12}],2:[function(require,module,exports){
'use strict';

var Baby = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'baby', frame);
  
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // add and play animations
  // this.animations.add('flap');
  // this.animations.play('flap', 12, true);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.allowGravity = true;
  

};

Baby.prototype = Object.create(Phaser.Sprite.prototype);
Baby.prototype.constructor = Baby;

Baby.prototype.update = function() {
  this.angle = Phaser.Math.radToDeg(Math.atan(this.body.velocity.y/this.body.velocity.x));
  
  if (!this.inWorld && this.world.y > this.game.height)
    this.destroy();
};

Baby.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = Baby;

},{}],3:[function(require,module,exports){
'use strict';

var Bullet = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bullet', frame);
  
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // add and play animations
  // this.animations.add('flap');
  // this.animations.play('flap', 12, true);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.allowGravity = true;
  this.isAlive = true;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  this.angle = Phaser.Math.radToDeg(Math.atan(this.body.velocity.y / this.body.velocity.x));
  if ((!this.inWorld && this.world.y > this.game.height) || !this.isAlive)
    this.destroy();
};

Bullet.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = Bullet;

},{}],4:[function(require,module,exports){
'use strict';

var Crosshair = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);

  this.anchor.setTo(0.5, 0.5);
  
  this.game.physics.p2.enableBody(this);
  this.body.data.gravityScale = 0;
  this.body.angularVelocity = 2;
  this.body.angularDamping = 0;
  
};

Crosshair.prototype = Object.create(Phaser.Sprite.prototype);
Crosshair.prototype.constructor = Crosshair;

Crosshair.prototype.update = function() {
  
  this.body.x = this.game.input.mousePointer.worldX;
  this.body.y = this.game.input.mousePointer.worldY;

  this.angle += this.rotateSpeed * (this.game.time.elapsed / 1000);
};

module.exports = Crosshair;

},{}],5:[function(require,module,exports){
'use strict';

var Enemy = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.health = 10;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
};

Enemy.prototype.decreaseHealth = function(amount, impactVelocity) {
  this.health -= amount;
  
  // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
     var emitter = this.game.add.emitter(this.x, this.y, 400);
     // this.addChild(emitter);
     emitter.width = this.width - 50;
     emitter.height = this.height - 50;


     //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
     // emitter.width = 800;

     emitter.makeParticles('explosion');

     emitter.minParticleSpeed.set(0, 0);
     emitter.maxParticleSpeed.set(30 * impactVelocity.x * -1, 1 * impactVelocity.y);

     emitter.gravity = 300;
     emitter.setRotation(-100, 100);
     // emitter.setXSpeed(0,0);
     // emitter.setYSpeed(0,0);
     emitter.minParticleScale = 0.25;
     emitter.maxParticleScale = 1;
     // emitter.setAll('body.allowGravity', false);
  
  if (this.health <= 0)
  {
    emitter.start(true, 2000, null, 50);
    this.destroy();
  }
};

module.exports = Enemy;

},{}],6:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.p2.enableBody(this);

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

},{}],7:[function(require,module,exports){
'use strict';

var Bullet = require('../prefabs/bullet');
var Crosshair = require('../prefabs/crosshair');

var Tank = function(game, x, y, frame) {
  this.firing = false;
  this.bulletCG = game.physics.p2.createCollisionGroup();
  this.enemyCG;
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'babyTank', 1);
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // tank engine sound
  this.tankEngineSound = this.game.add.audio('tankEngine');
  this.tankEngineSound.play('', 0, 1, true);

  // add animations
  this.animations.add('moveWheels');

  // enable physics
  game.physics.p2.enableBody(this);

  //  And some controls to play the game with
  this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.moveRightD = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  this.moveLeftA = game.input.keyboard.addKey(Phaser.Keyboard.A);

  // MAX SPEED
  this.maxSpeed = 300;
  this.decelerationSpeed = 5000;
  this.accelerationSpeed = 20000;

  // Create the crosshair
  this.crosshair = new Crosshair(game, game.width/2, game.height/2);
  game.add.existing(this.crosshair);

  // cannon
  this.cannon = new Phaser.Sprite(game, 27, -10, 'cannon');
  this.cannon.anchor.setTo(0, 0.5);
  this.addChild(this.cannon);
  this.cannonAngleMax = 98;
  this.cannonAngleMin = 350;
  this.tankFireSound = this.game.add.audio('tankPewPew');
  this.minPower = 600;
  this.maxPower = 2000;
  this.powerTime = 3000;
  
  // baby
  this.baby = new Phaser.Sprite(game, -40, -20, 'baby');
  this.baby.anchor.setTo(0.5, 0.5);
  this.addChild(this.baby);
};

Tank.prototype = Object.create(Phaser.Sprite.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.update = function() {
  // move the tank
  if (this.moveRight.isDown || this.moveRightD.isDown) {
    this.scale.x = 1;
    this.move(Phaser.Keyboard.RIGHT);
  }
  else if(this.moveLeft.isDown || this.moveLeftA.isDown) {
    this.scale.x = -1;
    this.move(Phaser.Keyboard.LEFT);
  }
  else {
    if (this.body.velocity.x > 0) {
      this.body.velocity.x -= this.decelerationSpeed * (this.game.time.elapsed / 1000);
      this.body.velocity.x = Phaser.Math.clamp(this.body.velocity.x, 0, this.maxSpeed);
    } else if(this.body.velocity.x < 0) {
      this.body.velocity.x += this.decelerationSpeed * (this.game.time.elapsed / 1000);
      this.body.velocity.x = Phaser.Math.clamp(this.body.velocity.x, -this.maxSpeed, 0);
    }
  }

  // make engine louder and animate when tank is moving
  if (this.body.velocity.x > 0.5 || this.body.velocity.x < -0.5) {
    this.tankEngineSound.volume = 0.5;
      this.animations.play('moveWheels', 10, true);
  } else {
    this.tankEngineSound.volume = 0.3;
    this.animations.stop('moveWheels');
  }

  // Update the cannon
  var angle = this.getAngleFromVector();
  if(this.scale.x > 0) {
    if(angle < 180)
      angle = Phaser.Math.clamp(angle, 0, this.cannonAngleMax);
    else
      angle = Phaser.Math.clamp(angle, this.cannonAngleMin, 360);
    this.cannon.angle = -angle;
  } else {
    if(angle < 180)
      angle = Phaser.Math.clamp(angle, 0, this.cannonAngleMax);
    else
      angle = Phaser.Math.clamp(angle, this.cannonAngleMin, 360);
    this.cannon.angle = -angle;
  }
  //this.cannon.angle = Phaser.Math.clamp(this.cannon.angle, this.cannonAngleMin, this.cannonAngleMax);
  
  // Update the crosshair
  if (this.firing)
    this.crosshair.body.angularVelocity += 8 * (this.game.time.elapsed / 1000);
};

Tank.prototype.move = function(moveKey) {
  if (moveKey == Phaser.Keyboard.RIGHT && this.body.velocity.x < this.maxSpeed) {
    this.body.velocity.x += this.accelerationSpeed * (this.game.time.elapsed / 1000);
  } else if(moveKey == Phaser.Keyboard.LEFT && this.body.velocity.x > -this.maxSpeed) {
    this.body.velocity.x -= this.accelerationSpeed * (this.game.time.elapsed / 1000);
  }
};

Tank.prototype.jump = function() {
  console.log(this.y);
  if (this.y >= 445)
    this.body.velocity.y += -400;
}

Tank.prototype.beforeFire = function() {
  this.firing = true;
  this.startFiring = (new Date()).getTime();
}

Tank.prototype.fire = function() {
  var timeElapsed = ((new Date()).getTime()) - this.startFiring;
  var bulletVelocity = this.getVectorCannon();
  var bullet = new Bullet(this.game, this.cannon.world.x + bulletVelocity.x * this.cannon.width * this.scale.x, this.cannon.world.y + bulletVelocity.y * this.cannon.width * -1);
  this.game.add.existing(bullet);
  
  bullet.body.setCollisionGroup(this.bulletCG);
  bullet.body.collides(this.enemyCG, this.hit, this);
  bulletVelocity.setMagnitude((timeElapsed / this.powerTime) * this.maxPower + this.minPower);
  
  bullet.fire(bulletVelocity.x * this.scale.x, -bulletVelocity.y);
  this.tankFireSound.play();
  this.crosshair.body.angularVelocity = 2;
  this.firing = false;
};

Tank.prototype.getVectorFromCursor = function() {
  var x = (this.crosshair.world.x - this.world.x) * this.scale.x;
  var y = -(this.crosshair.world.y - this.world.y);
  var posDiff = new Phaser.Point(x, y);
  return Phaser.Point.normalize(posDiff);
}

Tank.prototype.getVectorCannon = function() {
  var x = Math.cos(Phaser.Math.degToRad(this.cannon.angle)) * this.cannon.width;
  var y = Math.sin(Phaser.Math.degToRad(this.cannon.angle)) * this.cannon.width * -1;
  return Phaser.Point.normalize(new Phaser.Point(x, y));
}

Tank.prototype.getAngleFromVector = function() {
  var vec = this.getVectorFromCursor();
  var angle = Phaser.Math.radToDeg(Math.atan(vec.y / vec.x));
  if(vec.x < 0 && vec.y > 0)
    angle = 180 + angle;
  else if(vec.x < 0 && vec.y < 0)
    angle = angle + 180;
  else if(vec.x > 0 && vec.y < 0)
    angle = 360 + angle;
  return angle;
}

Tank.prototype.hit = function(bullet, enemy) {
  bullet.sprite.isAlive = false;
  enemy.sprite.decreaseHealth(3, bullet.velocity);
}

module.exports = Tank;

},{"../prefabs/bullet":3,"../prefabs/crosshair":4}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){

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

},{}],11:[function(require,module,exports){
'use strict';

var Tank = require('../prefabs/tank');
var Baby = require('../prefabs/baby');
var Ground = require('../prefabs/ground');
var Enemy = require('../prefabs/enemy');

function Play() {}
Play.prototype = {
  create: function() {
    var that = this;
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1200;
    this.game.physics.p2.setImpactEvents(true);

    // background
    this.background = this.game.add.tileSprite(0, 0, 5000, 500, 'background');
    this.flowers = this.game.add.sprite(0, this.game.height - 120, 'flowers');

    // Create/add the tank
    this.tank = new Tank(this.game, this.game.width/8, this.game.height/2);
    this.game.add.existing(this.tank);
    this.tank.cannon.z = -500;
    var tankCG = this.game.physics.p2.createCollisionGroup();
    this.tank.body.setCollisionGroup(tankCG);
    var crosshairCG = this.game.physics.p2.createCollisionGroup();
    this.tank.crosshair.body.setCollisionGroup(crosshairCG);

    // Create/add the ground
    this.ground = new Ground(this.game, 0, 500, 10000, 40);
    this.game.add.existing(this.ground);
    var groundCG = this.game.physics.p2.createCollisionGroup();
    this.ground.body.setCollisionGroup(groundCG);
    
    // Create/add a enemy
    this.enemy = new Enemy(this.game, 600, 300);
    this.game.add.existing(this.enemy);
    this.enemy.body.mass = 2;
    var enemyCG = this.game.physics.p2.createCollisionGroup();
    this.tank.enemyCG = enemyCG;
    this.enemy.body.setCollisionGroup(enemyCG);
    
    // Setup Collisions
    this.tank.body.collides( [groundCG, enemyCG] );
    this.enemy.body.collides( [groundCG, tankCG, this.tank.bulletCG] );
    this.ground.body.collides( [enemyCG, tankCG] );
    
    // Firing logic
    this.game.input.onDown.add(this.tank.beforeFire, this.tank);
    this.game.input.onUp.add(this.tank.fire, this.tank);
    
    // Jumping logic
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey.onDown.add(this.tank.jump, this.tank);

    // Camera
    this.game.camera.follow(this.tank, Phaser.Camera.FOLLOW_PLATFORMER);

    // World bounds
    this.game.world.setBounds(0, 0, 5000, 500);
  },
  update: function() {
    if(this.tank.world.x > 4500)
        this.game.state.start('gameover');
  }
};

module.exports = Play;

},{"../prefabs/baby":2,"../prefabs/enemy":5,"../prefabs/ground":6,"../prefabs/tank":7}],12:[function(require,module,exports){
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