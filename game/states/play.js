'use strict';

var Tank = require('../prefabs/tank');
var Ground = require('../prefabs/ground');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    // Create the tank
    this.tank = new Tank(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.tank);

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 490, 1000, 10);
    this.game.add.existing(this.ground);
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