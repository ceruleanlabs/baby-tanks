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
  var x = Math.cos(Phaser.Math.degToRad(this.cannon.angle  - this.body.angle)) * this.cannon.width;
  var y = Math.sin(Phaser.Math.degToRad(this.cannon.angle  - this.body.angle)) * this.cannon.width * -1;
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
