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
