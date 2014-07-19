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
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = true;
  

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  if (!this.inWorld)
    this.destroy();
};

Bullet.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = Bullet;
