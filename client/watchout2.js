/*------------------------------------------------------------------------------
                SETUP 
--------------------------------------------------------------------------------
*/

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  maxSpeed: 4,
  minSpeed: 0
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
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
  d3.select('.collisions')
      .text('Collisions: ' + gameStats.collisions);
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore);
  
  d3.select('.highscore').text('High Score: ' + gameStats.bestScore.toString());  
};

/*------------------------------------------------------------------------------
                PLAYER 
--------------------------------------------------------------------------------
*/

var Player = function() {
  this.startingX = 50;
  this.startingY = 50;
};

// initialize the player and players array
var players = [];
players.push(new Player());


/*------------------------------------------------------------------------------
                Enemy 
--------------------------------------------------------------------------------
*/

var createEnemies = function() {
  var getDX = function(id) {
    if (id < gameOptions.nEnemies * .50) {
      return Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed;
    } else {
      return -(Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed);
    }
  };

  var getDY = function(id) {
    if (id % 2 === 0) {
      Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed;
    } else {
      -(Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed);
    }
  };

  return _.range(0, gameOptions.nEnemies).map(function(i) {
    var newDX = getDX(i);
    var newDY = getDY(i);

    return {
      id: i, 
      x: axes.x(Math.random() * 100),
      y: axes.y(Math.random() * 100),
      dx: newDX,
      dy: newDY
    };
  });
};

// initialize the enemies and the enemies array
var enemies = createEnemies();


/*------------------------------------------------------------------------------
                MAIN GAME 
--------------------------------------------------------------------------------
*/

var render = function(enemies) {

  // DATA JOIN
  var enemiesOnBoard = gameBoard.selectAll('image.enemy')
                         .data(enemies, function(d) { return d.id; });

  // ENTER
  enemiesOnBoard.enter()
    .append('svg:image')
      .attr('class', 'enemy')
      .attr('x', function(enemy) { return enemy.x; })
      .attr('y', function(enemy) { return enemy.y; })
      .attr('height', '20px')
      .attr('width', '20px')
      .attr('xlink:href', 'asteroid.png');

  // UPDATE
  enemiesOnBoard
    .attr('x', function(enemy) { return enemy.x; })
    .attr('y', function(enemy) { return enemy.y; });

  // EXIT
  enemiesOnBoard.exit()
    .remove();
};

var updateEnemies = function(enemies) {
  console.log('updating...');
  _.each(enemies, function(e) {
    e.x = e.x + e.dx;
    e.y = e.y + e.dy;
  });
};

render(enemies);

setInterval(function() {
  updateEnemies(enemies);
  render(enemies);
}, 100);

























