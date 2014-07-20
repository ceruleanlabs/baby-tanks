'use strict';

var Tank = require('../prefabs/tank');
var Baby = require('../prefabs/baby');
var Ground = require('../prefabs/ground');
var Enemy = require('../prefabs/enemy');

function Play() {}
Play.prototype = {
  create: function() {
    var that = this;
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 1200;
    this.game.physics.p2.setImpactEvents(true);

    // background
    this.background = this.game.add.tileSprite(0, 0, 5000, 500, 'background');
    this.flowers = this.game.add.sprite(0, this.game.height - 120, 'flowers');

    // Create/add the tank
    this.tank = new Tank(this.game, this.game.width/8, this.game.height/2);
    this.game.add.existing(this.tank);
    this.tank.cannon.z = -500;
    var tankCG = this.game.physics.p2.createCollisionGroup();
    this.tank.body.setCollisionGroup(tankCG);
    var crosshairCG = this.game.physics.p2.createCollisionGroup();
    this.tank.crosshair.body.setCollisionGroup(crosshairCG);

    // Create/add the ground
    this.ground = new Ground(this.game, 0, 500, 10000, 40);
    this.game.add.existing(this.ground);
    var groundCG = this.game.physics.p2.createCollisionGroup();
    this.ground.body.setCollisionGroup(groundCG);
    
    // Create/add a enemy
    this.enemy = new Enemy(this.game, 600, 300);
    this.game.add.existing(this.enemy);
    this.enemy.body.mass = 2;
    var enemyCG = this.game.physics.p2.createCollisionGroup();
    this.tank.enemyCG = enemyCG;
    this.enemy.body.setCollisionGroup(enemyCG);
    
    // Setup Collisions
    this.tank.body.collides( [groundCG, enemyCG] );
    this.enemy.body.collides( [groundCG, tankCG, this.tank.bulletCG] );
    this.ground.body.collides( [enemyCG, tankCG] );
    
    // Firing logic
    this.game.input.onDown.add(this.tank.beforeFire, this.tank);
    this.game.input.onUp.add(this.tank.fire, this.tank);
    
    // Jumping logic
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    var fireKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey.onDown.add(this.tank.jump, this.tank);

    // Camera
    this.game.camera.follow(this.tank, Phaser.Camera.FOLLOW_PLATFORMER);

    // World bounds
    this.game.world.setBounds(0, 0, 5000, 500);
  },
  update: function() {
    if(this.tank.world.x > 4500)
        this.game.state.start('gameover');
  }
};

module.exports = Play;
