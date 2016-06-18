/*------------------------------------------------------------------------------
                GAME SETUP 
--------------------------------------------------------------------------------
*/

// Initializes game board dimensions and other game options
var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20,
  updateTime: 1000
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

/*------------------------------------------------------------------------------
                PLAYER 
--------------------------------------------------------------------------------
*/

// Define the player class 
class Player {
  constructor() {
    this.x = 50;
    this.y = 50;
  }

  playerRender(gameBoard) {
    console.log('rendering player...'); 
    var players = gameBoard.selectAll('circle.player').data(playersData);
    
    var dragmove = function(d) {
      console.log('dragging');
      d3.select(this)
          .attr('cx', d.x = d3.event.x)
          .attr('cy', d.y = d3.event.y);
    };

    var drag = d3.behavior.drag()
      .on('drag', dragmove);
    
    // ENTER
    players.enter()
      .append('svg:circle')
        .attr('class', 'player')
        .attr('cx', function(p) { return axes.x(p.x); })
        .attr('cy', function(p) { return axes.y(p.y); })
        .attr('r', 10)
        .attr('fill', 'red')
        .call(drag);

    // EXIT
    players.exit()
      .remove();
  }
}

// Establish drag function and events for player
var playersData = [];
var playerOne = new Player();
playersData.push(playerOne);
playerOne.playerRender(gameBoard);






/*------------------------------------------------------------------------------
                Enemy 
--------------------------------------------------------------------------------
*/
// Create the enemies data array and set random locations 
// information for each enemy
var createEnemies = function() {
  console.log('creating enemies');
  return _.range(0, gameOptions.nEnemies).map(function(i) {
    return { 
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
  });
};

var enemyData = createEnemies();


/*------------------------------------------------------------------------------
                Main Game Loop 
--------------------------------------------------------------------------------
*/

// Render the game board
var render = function(enemyData) {
  
  // DATA JOIN
  var enemies = gameBoard.selectAll('image.enemy')
                  .data(enemyData, function(d) { return d.id; });

  // ENTER
  enemies.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('x', function(enemy) { return axes.x(enemy.x); })
      .attr('y', function(enemy) { return axes.y(enemy.y); })
      .attr('height', '20px')
      .attr('width', '20px')
      .attr("xlink:href", "asteroid.png");

  // UPDATE
  enemies.transition()
           .duration(500)
           .attr('x', function(enemy) { return axes.x(Math.min(100, Math.max(0, enemy.x + Math.random() * 20 - 10))); })
           .attr('y', function(enemy) { return axes.y(Math.min(100, Math.max(0, enemy.y + Math.random() * 20 - 10))); });
 
  // EXIT
  enemies.exit()
    .remove();
};

setInterval(function() {
  render(enemyData);
}, gameOptions.updateTime);

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
























