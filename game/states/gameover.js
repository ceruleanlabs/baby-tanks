
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    this.titleText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2, 'babyFont', 'YOU ARE THE \nBEST BABY TANK', 45);
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
