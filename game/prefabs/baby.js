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
