'use strict';

var Bullet = require('../prefabs/bullet');
var Crosshair = require('../prefabs/crosshair');

var Tank = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'tank', frame);

  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // add and play animations
  // this.animations.add('flap');
  // this.animations.play('flap', 12, true);

  // enable gravity
  this.game.physics.p2.enableBody(this);

  //  And some controls to play the game with
  this.moveRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  this.moveLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

  // MAX SPEED
  this.maxSpeed = 300;
  this.decelerationSpeed = 5000;
  this.accelerationSpeed = 20000;

  // Create the crosshair
  this.crosshair = new Crosshair(this.game, this.game.width/2, this.game.height/2);
  this.game.add.existing(this.crosshair);
};

Tank.prototype = Object.create(Phaser.Sprite.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.update = function() {
  // move the tank
  if (this.moveRight.isDown) {
    this.move(Phaser.Keyboard.RIGHT);
  }
  else if(this.moveLeft.isDown) {
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
};

Tank.prototype.move = function(moveKey) {
  if (moveKey == Phaser.Keyboard.RIGHT && this.body.velocity.x < this.maxSpeed) {
    this.body.velocity.x += this.accelerationSpeed * (this.game.time.elapsed / 1000);
  } else if(moveKey == Phaser.Keyboard.LEFT && this.body.velocity.x > -this.maxSpeed) {
    this.body.velocity.x -= this.accelerationSpeed * (this.game.time.elapsed / 1000);
  }
};

Tank.prototype.fire = function() {
  var bullet = new Bullet(this.game, this.body.x, this.body.y);
  this.game.add.existing(bullet);
  var bulletVelocity = this.getAngleFromCursor();
  bullet.fire(bulletVelocity.x, bulletVelocity.y);
  this.getAngleFromCursor();
};

Tank.prototype.getAngleFromCursor = function() {
  var posDiff = new Phaser.Point(this.crosshair.x - this.x, this.crosshair.y - this.y);
  return Phaser.Point.normalize(posDiff).setMagnitude(1000);
}

module.exports = Tank;
