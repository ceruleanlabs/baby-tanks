'use strict';

var Crosshair = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'crosshair', frame);

  this.anchor.setTo(0.5, 0.5);
  this.rotateSpeed = 90;
  
};

Crosshair.prototype = Object.create(Phaser.Sprite.prototype);
Crosshair.prototype.constructor = Crosshair;

Crosshair.prototype.update = function() {
  
  this.x = this.game.input.mousePointer.x;
  this.y = this.game.input.mousePointer.y;

  this.angle += this.rotateSpeed * (this.game.time.elapsed / 1000);
};

module.exports = Crosshair;
