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
