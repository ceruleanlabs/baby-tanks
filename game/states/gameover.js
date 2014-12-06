
'use strict';
function GameOver() {}

GameOver.prototype = {
  init: function(won) {
    if(won) {
      this.text = 'YOU ARE THE \nBEST BABY TANK';
    } else {
      this.text = 'YOU LOSE';
    }
  },

  preload: function () {

  },
  create: function () {
    this.titleText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2, 'babyFont', this.text, 45);
    this.titleText.fixedToCamera = false;

    this.instructionsText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2 + 100, 'babyFont', 'Click anywhere to play BABY TANKS again', 22);
  },

  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;
