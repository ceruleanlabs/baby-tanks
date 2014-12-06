'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'baby-tanks');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('level1_1', require('./states/level1_1'));
  game.state.add('level1_2', require('./states/level1_2'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('next_level', require('./states/next_level'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};