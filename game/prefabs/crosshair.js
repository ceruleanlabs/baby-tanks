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

  if(this.charging) {
    this.body.angularVelocity += this.angularAcceleration * (this.game.time.elapsed / 1000);
  }

  this.angle += this.rotateSpeed * (this.game.time.elapsed / 1000);
};

Crosshair.prototype.startCharge = function() {
  this.charging = true;
};

Crosshair.prototype.stopCharge = function() {
  this.charging = false;
  this.body.angularVelocity = this.defaultAngularVelocity;
};

module.exports = Crosshair;
