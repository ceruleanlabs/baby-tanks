'use strict';

var Castle = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'castle', 0);
  this.name = "castle";
  this.health = 2;

  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.data.gravityScale = 0;
  this.body.static = true;
  this.destroyed = false;
  this.collissionMagnitude = 60;

  this.body.onBeginContact.add(this.checkCollision, this);
};

Castle.prototype = Object.create(Phaser.Sprite.prototype);
Castle.prototype.constructor = Castle;

Castle.prototype.update = function() {};

Castle.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body) {
    if(body.sprite.name === 'bullet') {
      if((new Phaser.Point(body.velocity.x, body.velocity.y)).getMagnitude() > this.collissionMagnitude) {
        if(this.frame == 0) {
          this.damage();
        } else {
          this.demolish();
          this.destroyed = true;
          this.destroy();
        }
        body.sprite.destroy();
      }
    }
  }
};

Castle.prototype.damage = function() {
  this.frame = 1;
  this.blowupStage1();
}

Castle.prototype.demolish = function() {
  this.blowupStage1();

  var emitter = this.game.add.emitter(this.x, this.y, 400);
  emitter.width = this.width - 50;
  emitter.height = this.height - 50;
  emitter.makeParticles('smoke');
  emitter.setAlpha(0.3, 0.8);
  emitter.minParticleSpeed.set(0, 0);
  emitter.minParticleSpeed.set(-74, -200);
  emitter.maxParticleSpeed.set(100, -100);
  emitter.gravity = 50;
  emitter.setRotation(-100, 100);
  emitter.minParticleScale = 0.25;
  emitter.maxParticleScale = 5;

  this.game.add.tween(emitter).to( { alpha: 0 }, 4000, Phaser.Easing.Back.InOut, true, 0, Number.MAX_VALUE, true);
  emitter.start(true, 4000, null, 50);
}

Castle.prototype.blowupStage1 = function() {
  var emitter = this.game.add.emitter(this.x, this.y, 400);
  emitter.width = this.width - 50;
  emitter.height = this.height - 50;
  emitter.makeParticles('bricksplosion', 3);
  emitter.minParticleSpeed.set(-100, -300);
  emitter.maxParticleSpeed.set(100, -100);
  emitter.gravity = 300;
  emitter.setRotation(-100, 100);
  emitter.minParticleScale = 0.25;
  emitter.maxParticleScale = 1;

  emitter.start(true, 2000, null, 50);
}

module.exports = Castle;
