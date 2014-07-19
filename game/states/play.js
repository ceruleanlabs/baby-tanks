'use strict';

var Tank = require('../prefabs/tank');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    this.tank = new Tank(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.tank);
  },
  update: function() {
    
  },
  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;