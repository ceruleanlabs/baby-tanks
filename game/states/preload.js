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
    this.load.spritesheet('tank', 'assets/tank_sheet.png', 100, 80, 1);
    this.load.image('ground', 'assets/grass.png');
    this.load.image('block', 'assets/grassy.png');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('cannon', 'assets/cannon.png');
    this.load.image('bullet', 'assets/bullet.png');

    this.load.bitmapFont('babyFont', 'assets/fonts/babyFont/font.png', 'assets/fonts/babyFont/font.fnt');
    this.load.audio('tankPewPew', 'assets/tank_pewpew.mp3');
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
