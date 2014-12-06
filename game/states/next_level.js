'use strict';

function NextLevel() {}

NextLevel.prototype = {
  init: function(level, subLevel, won) {
    this.nextLevel = level || 1;
    this.nextSubLevel = subLevel || 1;
    this.won = won || false;
  },

  preload: function() {

  },

  create: function () {
    this.text = this.won ? 'Click anywhere to play level'+this.nextLevel+'-'+this.nextSubLevel : 'You lost :( \n Click anywhere to replay level';
    this.titleText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2, 'babyFont', 'LEVEL '+this.nextLevel+'-'+this.nextSubLevel, 45);
    this.titleText.fixedToCamera = false;

    this.instructionsText = this.game.add.bitmapText(this.game.camera.width / 2 - 300, this.game.camera.height / 2 + 100, 'babyFont', this.text, 22);
  },


  update: function() {
    if (this.game.input.activePointer.justPressed()) {
      this.game.state.start('level'+ this.nextLevel+'_'+this.nextSubLevel);
    }
  }
};

module.exports = NextLevel;
