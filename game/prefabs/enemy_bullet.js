'use strict';

var EnemyBullet = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bullet', frame);
  this.name = "enemy_bullet";

  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.data.gravityScale = 0;

  // set the time to live
  game.time.events.add(Phaser.Timer.SECOND * 3, this.destroy, this);
};

EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;

EnemyBullet.prototype.update = function() {
  this.rotation = Math.atan(this.body.velocity.y / this.body.velocity.x);
  if ((!this.inWorld && this.world.y > this.game.height))
    this.destroy();
};

EnemyBullet.prototype.fire = function(x, y) {
  this.body.velocity.x = x;
  this.body.velocity.y = y;
}

module.exports = EnemyBullet;
