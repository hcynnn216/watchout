// Initializes game board dimensions and other game options
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

// Establishes the initial values for the scoreboard
var gameStats = {
  score: 0,
  bestScore: 0
};

var x = d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]);
var y = d3.scale.linear().domain([0, 100]).range([0, gameOptions.height]);

// Declares the the game board
var gameBoard = d3.select('body').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select('.current')
      .text('Current score: ' + gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  
  d3.select('.highscore').text('High Score: ' + gameStats.bestScore.toString());  
};