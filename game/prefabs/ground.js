'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  
  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.p2.enable(this);

  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.data.gravityScale = 0;
  this.body.static = true;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;
