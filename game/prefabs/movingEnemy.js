'use strict';
var MovingEnemy = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.name = 'enemy';
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.mass = 3;
  this.health = 10;

  // Magnitude of hits required to damage this entity
  this.collissionMagnitude = 30;

  // Movement variables
  this.acceleration = 400; // px / second
  this.maxSpeed = 400; // px / second
  this.scale.x = -1; // starts facing player
  this.changeTime = 2; // changes directions every three seconds

  this.shouldChangeDirection = false;

  this.body.onBeginContact.add(this.checkCollision, this);
};

MovingEnemy.prototype = Object.create(Phaser.Sprite.prototype);
MovingEnemy.prototype.constructor = MovingEnemy;

MovingEnemy.prototype.update = function() {
  this.updateMovement(this.scale.x);
};

MovingEnemy.prototype.decreaseHealth = function(amount, impactVelocity) {
  this.health -= amount;

  // Create the death particles
  if (this.health <= 0) {
    var emitter = this.game.add.emitter(this.x, this.y, 400);
    emitter.width = this.width - 50;
    emitter.height = this.height - 50;
    emitter.makeParticles('explosion');
    emitter.minParticleSpeed.set(0, 0);
    emitter.maxParticleSpeed.set(10 * impactVelocity.x * -1, 1 * impactVelocity.y);
    emitter.gravity = 300;
    emitter.setRotation(-100, 100);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 1;

    emitter.start(true, 2000, null, 50);
    // this.destroy();
  } else {
    // Flash red when taking damage
    this.game.add.tween(this).to( {tint: 0xFF0000 }, 75, Phaser.Easing.Linear.None, true, 0, 0, true);
  }
};

MovingEnemy.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body) {
    if (body.sprite.name == "babyTank") {
      // debugger
      this.decreaseHealth(10, new Phaser.Point(30, 30)) //{x:30, y:30})
    }

    if(body.sprite.name == "bullet") {
      if((new Phaser.Point(body.velocity.x, body.velocity.y)).getMagnitude() > this.collissionMagnitude) {
        this.decreaseHealth(5, body.velocity);
        body.sprite.destroy();
      }
    }

    // if (body.sprite.name == "babyTank") {
    //   this.decreaseHealth(this.health, this.collissionMagnitude);
    // }
  }
};

MovingEnemy.prototype.updateMovement = function(direction) {
  this.body.velocity.x = 300 * direction;
  
  var second = Math.floor(this.game.time.time/1000);
  
  if ((second % this.changeTime === 0) && (this.shouldChangeDirection)) {
    this.scale.x *= -1;
    this.shouldChangeDirection = false; 
  } else if (second % this.changeTime !== 0) {
    this.shouldChangeDirection = true;
  }
};

// MovingEnemy.prototype.get

module.exports = MovingEnemy;
