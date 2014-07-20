'use strict';

var Enemy = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.health = 10;

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
};

Enemy.prototype.decreaseHealth = function(amount, impactVelocity) {
  this.health -= amount;
  
  // Emitters have a center point and a width/height, which extends from their center point to the left/right and up/down
     var emitter = this.game.add.emitter(this.x, this.y, 400);
     // this.addChild(emitter);
     emitter.width = this.width - 50;
     emitter.height = this.height - 50;


     //  This emitter will have a width of 800px, so a particle can emit from anywhere in the range emitter.x += emitter.width / 2
     // emitter.width = 800;

     emitter.makeParticles('explosion');

     emitter.minParticleSpeed.set(0, 0);
     emitter.maxParticleSpeed.set(30 * impactVelocity.x * -1, 1 * impactVelocity.y);

     emitter.gravity = 300;
     emitter.setRotation(-100, 100);
     // emitter.setXSpeed(0,0);
     // emitter.setYSpeed(0,0);
     emitter.minParticleScale = 0.25;
     emitter.maxParticleScale = 1;
     // emitter.setAll('body.allowGravity', false);
  
  if (this.health <= 0)
  {
    emitter.start(true, 2000, null, 50);
    this.destroy();
  }
};

module.exports = Enemy;
