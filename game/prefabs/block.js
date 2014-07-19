'use strict';

var Block = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'block', frame);
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);

};

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;

Block.prototype.update = function() {
  // this.angle = Phaser.Math.radToDeg(Math.atan(this.body.velocity.y / this.body.velocity.x));
};

module.exports = Block;
