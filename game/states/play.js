'use strict';

var Tank = require('../prefabs/tank');
var Ground = require('../prefabs/ground');
var Bullet = require('../prefabs/bullet');

function Play() {}
Play.prototype = {
  create: function() {
    var that = this;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    // Create the tank
    this.tank = new Tank(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.tank);

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 490, 1000, 10);
    this.game.add.existing(this.ground);
    
    // Firing logic
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    fireKey.onDown.add(function() {
      that.bullet = new Bullet(that.game, that.game.width/4, that.game.height/4);
      that.game.add.existing(that.bullet);
      that.bullet.fire(500, -500);
    }, this.bullet);
  },
  update: function() {
    // enable collisions between the tank and the ground
    this.game.physics.arcade.collide(this.tank, this.ground, null, null, this);
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;