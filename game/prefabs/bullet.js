'use strict';

var Bullet = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bullet', frame);
  this.name = "bullet";
  
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);

  // set the time to live
  game.time.events.add(Phaser.Timer.SECOND * 3, this.destroy, this);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() {
  this.rotation = Math.atan(this.body.velocity.y / this.body.velocity.x);
  if ((!this.inWorld && this.world.y > this.game.height))
    this.destroy();
};

Bullet.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = Bullet;
