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

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

// Declares the the game board
var gameBoard = d3.select('body').append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height);


// Functions to set and update the scoreboards
var updateScore = function() {
  d3.select('.current')
      .text('Current score: ' + gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  
  d3.select('.highscore').text('High Score: ' + gameStats.bestScore.toString());  
};

// Create the enemies data array and set random locations 
// information for each enemy
var createEnemies = function() {
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return { 
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

// Render the game board
var render = function(enemyData) {
  var enemies = gameBoard.selectAll('circle.enemies')
                  .data(enemyData, function(d) { return d.id; });
  
  enemies.enter()
    .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', function(enemy) { return axes.x(enemy.x); })
      .attr('cy', function(enemy) { return axes.y(enemy.y); })
      .attr('r', 10)
      .attr('fill', 'red');

  enemies.exit()
    .remove();
};


// Create and render enemies
render(createEnemies());
























