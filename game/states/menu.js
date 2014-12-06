
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: 'red', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 200, 'baby-tank');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.bitmapText(this.game.world.centerX - 325, 200, 'babyFont', 'BABY TANKS', 72);

    this.instructionsText = this.game.add.bitmapText(this.game.world.centerX, 400, 'babyFont', 'Click anywhere to play "BABY TANKS"', 16);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 500, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // music
    this.music = this.game.add.audio('backgroundMusic', 1, true);
    this.music.play('', 0, 1, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('next_level',true, false, 1,1,true);
    }
  }
};

module.exports = Menu;
