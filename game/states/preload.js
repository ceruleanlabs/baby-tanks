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
    this.load.spritesheet('tank', 'assets/tank_sheet.png', 100, 80, 2);
    this.load.image('baby', 'assets/baby.png');
    this.load.image('ground', 'assets/grass.png');
    this.load.image('enemy', 'assets/yoman.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('cannon', 'assets/cannon.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.spritesheet('explosion', 'assets/explosion_sheet.png', 12, 12, 3);

    this.load.bitmapFont('babyFont', 'assets/fonts/babyFont/font.png', 'assets/fonts/babyFont/font.fnt');
    this.load.audio('backgroundMusic', 'assets/music.wav');
    this.load.audio('tankPewPew', 'assets/tank_pewpew.mp3');
    this.load.audio('tankEngine', 'assets/tank_enginesound.mp3');
    this.load.audio('bulletSplode', 'assets/bullet_splosion.mp3');
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
