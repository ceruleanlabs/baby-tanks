'use strict';
var MovingEnemy = function(game, x, y, moveDistance, moveSpeed, invincible, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'smallEnemy', frame);
  this.name = 'enemy';
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.mass = 3;

  this.health = 10;
  this.invincible = invincible || false;

  // Magnitude of hits required to damage this entity
  this.collissionMagnitude = 30;

  // Movement variables
  this.acceleration = 400; // px / second
  this.maxSpeed = 400; // px / second
  this.moveSpeed = moveSpeed || 300;
  this.scale.x = -1; // starts facing player
  this.changeTime = 2; // changes directions every three seconds
  this.startingX = x;
  this.moveDistance = moveDistance || 100;

  this.animations.add('moveMouth');

  this.body.onBeginContact.add(this.checkCollision, this);
};

MovingEnemy.prototype = Object.create(Phaser.Sprite.prototype);
MovingEnemy.prototype.constructor = MovingEnemy;

MovingEnemy.prototype.update = function() {
  this.updateMovement(this.scale.x);

  if (this.body.velocity.x > 0.5 || this.body.velocity.x < -0.5) {
    this.animations.play('moveMouth', 10, true);
  } else {
    this.animations.stop('moveMouth');
  }
};

MovingEnemy.prototype.decreaseHealth = function(amount, impactVelocity) {
  amount = amount || this.health;
  // console.log(impactVelocity);
  impactVelocity = impactVelocity || {x:300, y:500};

  this.health -= amount;

  // Create the death particles
  if (this.health <= 0) {
    var emitter = this.game.add.emitter(this.x, this.y, 400);
    emitter.width = this.width - 50;
    emitter.height = this.height - 50;
    emitter.makeParticles('explosion', [0, 1, 2]);
    emitter.minParticleSpeed.set(0, 0);
    emitter.maxParticleSpeed.set(10 * impactVelocity.x * -1, 1 * impactVelocity.y);
    emitter.gravity = 300;
    emitter.setRotation(-100, 100);
    emitter.minParticleScale = 0.25;
    emitter.maxParticleScale = 1;

    emitter.start(true, 2000, null, 50);
    this.destroy();
  } else {
    // Flash black when taking damage
    this.game.add.tween(this).to( {tint: 0x000000 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
  }
};

MovingEnemy.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body && body.sprite) {
    if (body.sprite.name === 'babyTank') {
      body.sprite.modifyHealth(-1);

      if (!this.invincible) {
        this.game.time.events.add(Phaser.Timer.SECOND/1000 , this.decreaseHealth, this);
      }

    } else if(body.sprite.name === 'bullet') {
      if((new Phaser.Point(body.velocity.x, body.velocity.y)).getMagnitude() > this.collissionMagnitude) {
        this.decreaseHealth(5, body.velocity);
        body.sprite.destroy();
      }
    }
  }
};

MovingEnemy.prototype.updateMovement = function(direction) {
  this.body.velocity.x = this.moveSpeed * direction;

  if ( this.x <= this.startingX - this.moveDistance ) {
    this.scale.x = 1;
  } else if ( this.x >= this.startingX + this.moveDistance ) {
    this.scale.x = -1;
  }

};

// MovingEnemy.prototype.get

module.exports = MovingEnemy;
