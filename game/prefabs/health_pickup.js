'use strict';

var HealthPickup = function(game, x, y, amount, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'heart', frame);
  this.name = "health";
  this.amount = amount || 1;
  
  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);

  // set the time to live
};

HealthPickup.prototype = Object.create(Phaser.Sprite.prototype);
HealthPickup.prototype.constructor = HealthPickup;

HealthPickup.prototype.update = function() {};

HealthPickup.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body) {
      console.log('adasd')
    if(body.sprite.name === 'babyTank') {
      console.log('adasd')
      game.time.events.add(Phaser.Timer.SECOND/1000, this.destroy, this);
    }
    if(body.sprite.name === 'bullet') {
      game.time.events.add(Phaser.Timer.SECOND/1000, this.destroy, this);
    }
  }
};

module.exports = HealthPickup;
