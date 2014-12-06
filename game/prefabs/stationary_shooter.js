'use strict';
var EnemyBullet = require('../prefabs/enemy_bullet');

var StationaryShooter = function(game, x, y, frame) {
  // The super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
  this.anchor.setTo(0.5, 0.5);

  // enable gravity
  this.game.physics.p2.enableBody(this);
  this.body.mass = 3;
  this.health = 10;

  // Magnitude of hits required to damage this entity
  this.collissionMagnitude = 30;

  this.body.onBeginContact.add(this.checkCollision, this);
};

StationaryShooter.prototype = Object.create(Phaser.Sprite.prototype);
StationaryShooter.prototype.constructor = StationaryShooter;

StationaryShooter.prototype.update = function() {
  if(this.lastFire == null)
    this.lastFire = (new Date()).getTime();

  if(this.target != null) {
    if((new Date()).getTime() - this.lastFire > 1000) {
      var fromPosition = new Phaser.Point(this.position.x + (this.width / 2 * -1), this.position.y);
      var targetPosition = new Phaser.Point(this.target.position.x, this.target.position.y);
      var angle = Phaser.Math.angleBetweenPoints(fromPosition, targetPosition); // Rad
      angle = angle - this.rotation;
      angle = Phaser.Math.normalizeAngle(angle);

      // var line = new Phaser.Line(test.x, test.y, test.x + (Math.cos(angle) * 400), test.y + (Math.sin(angle) * 400))
      // this.game.debug.geom(line,  'rgba(0,0,0,1)');

      this.lastFire = (new Date()).getTime();
      var bullet = new EnemyBullet(this.game, fromPosition.x, fromPosition.y);
      this.game.add.existing(bullet);
      var bulletVelocity = Phaser.Point.normalize(new Phaser.Point(Math.cos(angle), Math.sin(angle)));
      bulletVelocity.setMagnitude(600);
      bullet.fire(bulletVelocity.x, bulletVelocity.y);
    }
  }
};

StationaryShooter.prototype.decreaseHealth = function(amount, impactVelocity) {
  this.health -= amount;

  // Create the death particles
  if (this.health <= 0)
  {
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
    this.destroy();
  } else {
    // Flash red when taking damage
    this.game.add.tween(this).to( {tint: 0xFF0000 }, 75, Phaser.Easing.Linear.None, true, 0, 0, true);
  }
};

StationaryShooter.prototype.checkCollision = function(body, shapeA, shapeB, contactEquations) {
  if(body) {
    if(body.sprite.name == "bullet") {
      if((new Phaser.Point(body.velocity.x, body.velocity.y)).getMagnitude() > this.collissionMagnitude) {
        this.decreaseHealth(5, body.velocity);
        body.sprite.destroy();
      }
    }
  }
};


module.exports = StationaryShooter;
