'use strict';

var Tank = require('../prefabs/tank');
var Ground = require('../prefabs/ground');
var Block = require('../prefabs/block');

function Play() {}
Play.prototype = {
  create: function() {
    var that = this;
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1200;

    // Create/add the tank
    this.tank = new Tank(this.game, this.game.width/2, this.game.height/2);
    this.game.add.existing(this.tank);
    this.tank.cannon.z = -500;
    var tankCG = this.game.physics.p2.createCollisionGroup();
    this.tank.body.setCollisionGroup(tankCG);
    var crosshairCG = this.game.physics.p2.createCollisionGroup();
    this.tank.crosshair.body.setCollisionGroup(crosshairCG);

    // Create/add the ground
    this.ground = new Ground(this.game, 0, 490, 2000, 10);
    this.game.add.existing(this.ground);
    var groundCG = this.game.physics.p2.createCollisionGroup();
    this.ground.body.setCollisionGroup(groundCG);
    
    // Create/add a block
    this.block = new Block(this.game, 600, 300);
    this.game.add.existing(this.block);
    var blockCG = this.game.physics.p2.createCollisionGroup();
    this.block.body.setCollisionGroup(blockCG);
    
    // Setup Collisions
    this.tank.body.collides(groundCG);
    this.ground.body.collides(tankCG);
    
    // Firing logic
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey.onDown.add(this.tank.beforeFire, this.tank);
    fireKey.onUp.add(this.tank.fire, this.tank);

    // Camera
    this.game.camera.follow(this.tank, Phaser.Camera.FOLLOW_PLATFORMER);

    // World bounds
    this.game.world.setBounds(0, 0, 5000, 500);
  },
  update: function() {
  },
  click: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;