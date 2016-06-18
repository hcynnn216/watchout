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

// class Player {
//   constructor() {
//     this.path
//   }
// }

// Create the enemies data array and set random locations 
// information for each enemy
var createEnemies = function() {
  console.log("creating enemies");
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return { 
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var enemyData = createEnemies();

// Render the game board
var render = function(enemyData) {
  
  // DATA JOIN
  var enemies = gameBoard.selectAll('circle.enemies')
                  .data(enemyData);

  // ENTER
  enemies.enter()
    .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', function(enemy) { return axes.x(enemy.x); })
      .attr('cy', function(enemy) { return axes.y(enemy.y); })
      .attr('r', 10)
      .attr('background-image', 'red');
 
  // // UPDATE
  // enemies.transition()
  //          .duration(500)
  //          .attr('cx', function(enemy) { return axes.x(Math.min(100, Math.max(0, enemy.x + Math.random() * 20 - 10))); })
  //          .attr('cy', function(enemy) { return axes.y(Math.min(100, Math.max(0, enemy.y + Math.random() * 20 - 10))); });

  // EXIT
  enemies.exit()
    .remove();
};

var update = function(enemyData) {
  console.log('updating...');
  gameBoard.selectAll('.enemy')
           .data(enemyData)
           .transition()
             .duration(500)
             .attr('cx', function(enemy) { return axes.x(Math.min(100, Math.max(0, enemy.x + Math.random() * 20 - 10))); })
             .attr('cy', function(enemy) { return axes.y(Math.min(100, Math.max(0, enemy.y + Math.random() * 20 - 10))); });
};

render(enemyData);

setInterval(function() {
  update(enemyData);
}, 500);

// var startGame = function() {
//   var enemyData = createEnemies();
//   render(enemyData);
  
//   setInterval(function() { 
//     update(enemyData);
//   }, 1000);
// };

// startGame();

// var startGame = function() {
//   setInterval(function() {
//     render();
//     moveEnemies();
//   }, 1000);
// };

// // Create and render enemies
// 

// var checkCollision = function(enemy, collidedCallback) {
//   _.each()
// };

// var tweenWithCollisionDetection = function() {
//   var enemy = d3.select(this);

//   var startPos = {
//     x: parseFloat
//   }
// }
























