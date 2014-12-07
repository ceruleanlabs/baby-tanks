'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('flowers', 'assets/flowers.png');
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('baby-tank', 'assets/baby-tank.jpg');
    this.load.spritesheet('bigTank', 'assets/bigtank_sheet.png', 100, 80);
    this.load.spritesheet('babyTank', 'assets/babytank_sheet.png', 100, 64);
    this.load.spritesheet('babies', 'assets/babies_sheet.png', 20, 40);
    this.load.image('ground', 'assets/grass.png');
    this.load.spritesheet('bigEnemy', 'assets/bigevil_sheet.png', 160, 152);
    this.load.spritesheet('smallEnemy', 'assets/smallevil_sheet.png', 100, 64);
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('cannon', 'assets/cannon.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('heart', 'assets/heart.png');
    this.load.image('brickWall', 'assets/brick_wall.png');
    this.load.spritesheet('smoke', 'assets/smoke_sheet.png', 16, 16);
    this.load.spritesheet('castle', 'assets/castle.png', 300, 300);
    this.load.spritesheet('explosion', 'assets/explosion_sheet.png', 12, 12, 3);
    this.load.spritesheet('bricksplosion', 'assets/brick_explosion_sheet.png', 24, 24, 4);
    this.load.spritesheet('big_evil', 'assets/bigevil_sheet.png', 160, 152, 4);

    this.load.bitmapFont('babyFont', 'assets/fonts/babyFont/font.png', 'assets/fonts/babyFont/font.fnt');
    this.load.audio('backgroundMusic', 'assets/sounds/background_music.m4a');
    this.load.audio('tankPewPew', 'assets/sounds/tank_pewpew.mp3');
    this.load.audio('tankEngine', 'assets/sounds/tank_enginesound.mp3');
    this.load.audio('tankCharging', 'assets/sounds/tank_charge.m4a');
    // this.load.audio('bulletSplode', 'assets/sounds/bullet_splosion.mp3');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
