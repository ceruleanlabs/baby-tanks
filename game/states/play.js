'use strict';

var Tank = require('../prefabs/tank');
var Ground = require('../prefabs/ground');
var Block = require('../prefabs/block');

function Play() {}
Play.prototype = {
  create: function() {
    var that = this;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1200;

    // Create/add the tank
    this.tank = new Tank(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.tank);

    // Create/add the ground
    this.ground = new Ground(this.game, 0, 490, 1000, 10);
    this.game.add.existing(this.ground);
    
    // Create/add a block
    this.block = new Block(this.game, 0, 300);
    this.game.add.existing(this.block);
    
    // Firing logic
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey.onDown.add(this.tank.fire, this.tank);

    // Camera
    this.game.camera.follow(this.tank, Phaser.Camera.FOLLOW_PLATFORMER);

    // World bounds
    this.game.world.setBounds(0, 0, 5000, 500);
  },
  update: function() {
    // enable collisions with the ground
    this.game.physics.arcade.collide(this.tank, this.ground, null, null, this);
    this.game.physics.arcade.collide(this.block, this.ground, null, null, this);
  },
  click: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;