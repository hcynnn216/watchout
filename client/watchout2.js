/*------------------------------------------------------------------------------
                SETUP 
--------------------------------------------------------------------------------
*/

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  maxSpeed: 1,
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

// Draw a border around the gameBoard
var gameBoardBorder = gameBoard.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', gameOptions.height)
            .attr('width', gameOptions.width)
            .style('stroke', 'black')
            .style('fill', 'none')
            .style('stroke-width', 3);


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

// var Player = function() {
//   this.startingX = 50;
//   this.startingY = 50;
// };

// // initialize the player and players array
// var players = [];
// players.push(new Player());
// Define the player class 

class Player {
  constructor() {
    this.x = 50;
    this.y = 80;
  }

  playerRender(gameBoard) {
    var players = gameBoard.selectAll('circle.player').data(playersData);
    var radius = 10;
    
    var dragmove = function(d) {
      d3.select(this)
          .attr('cx', d.x = Math.max(radius, Math.min(gameOptions.width - radius, d3.event.x)))
          .attr('cy', d.y = Math.max(radius, Math.min(gameOptions.height - radius, d3.event.y)));
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

var playersData = [];
var playerOne = new Player();
playersData.push(playerOne);

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
      return Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed;
    } else {
      return -(Math.random() * (gameOptions.maxSpeed - gameOptions.minSpeed) + gameOptions.minSpeed);
    }
  };

  return _.range(0, gameOptions.nEnemies).map(function(i) {
    var newDX = getDX(i);
    var newDY = getDY(i);

    return {
      id: i, 
      x: axes.x(Math.random() * (90 - 10) + 10),
      y: axes.y(Math.random() * (90 - 10) + 10),
      dx: newDX,
      dy: newDY,
      collision: false
    };
  });
};

// initialize the enemies and the enemies array
var enemies = createEnemies();

// Collision Detection
// Check for collisions with the player object
var checkCollision = function() {
  var enemies = d3.selectAll('.enemy');
  var player = d3.selectAll('.player');
            
  var enemiesArray = enemies[0].map(function(e) {
    var enemyX = e.x.animVal.value;
    var enemyY = e.y.animVal.value;
    return { x: enemyX, y: enemyY };
  });

  _.each(enemiesArray, function(enemy) {
    var radiusSum = 20; 
    var cx = gameBoard.selectAll('circle.player').attr('cx'); 
    var cy = gameBoard.selectAll('circle.player').attr('cy'); 
    var xDiff = parseFloat(enemy.x) - parseFloat(cx);
    var yDiff = parseFloat(enemy.y) - parseFloat(cy);
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if (separation <= radiusSum) {
      throttledOnCollision();
    }

  });

};

var onCollision = function() {
  gameStats.collisions++;
  updateBestScore();
  gameStats.score = 0;
  updateScore();
};

var throttledOnCollision = _.throttle(onCollision, 500);

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
    //.transition()
    .attr('x', function(enemy) { return enemy.x; })
    .attr('y', function(enemy) { return enemy.y; });

  // EXIT
  enemiesOnBoard.exit()
    .remove();
};

var reverseEnemyDirection = function(enemy) {
  enemy.dx = -enemy.dx;
  enemy.dy = -enemy.dy;
};

var updateEnemies = function(enemies) {

  var checkEnemiesCollision = function(e) {
    var nextX = e.x + e.dx;
    var nextY = e.y + e.dy;

    for (var i = 0; i < enemies.length; i++) {
      if (enemyCoords[e.id] !== enemyCoords[enemies[i].id]) {
        var distX = nextX - enemyCoords[enemies[i].id].x; 
        var distY = nextY - enemyCoords[enemies[i].id].y;
        var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

        if (dist < 20 && e.collision === false) {
          // If there is a collision, reverse the direction of the ball
          reverseEnemyDirection(e);
          e.collision = true;
          return true;
        }
      }
    }
    return false;
  };

  // Create an array of coordinates of all enemy objects
  // Return [enemy x coordinate, enemy y coordinate, enemy id];
  var enemyCoords = {};

  _.each(enemies, function(e) {
    enemyCoords[e.id] = {x: e.x, y: e.y };
  });

  _.each(enemies, function(e) {
    // check if next x value would hit the boundaries of the board
    // if so, reverse the x value so that the ball will travel
    // in the opposite direction
    var nextX = e.x + e.dx;
    var nextY = e.y + e.dy;

    e.collision = checkEnemiesCollision(e);

    if (nextX - 10 <= 0) {
      e.dx = -e.dx;
      e.x = nextX;
    } else if (nextX + 25 >= gameOptions.width) {
      e.dx = -e.dx;
      e.x = nextX;
    } else {
      e.x = nextX;
    }

    if (nextY - 10 <= 0) { 
      e.dy = -e.dy;
      e.y = nextY;
    } else if (nextY + 25 >= gameOptions.height) {
      e.dy = -e.dy;
      e.y = nextY;
    } else {
      e.y = nextY;
    }

    // check for collision with other enemy objects
    // if so, reverse directions
    // _.each(enemies, function(otherEnemy) {
    //   // For all enemy objects other than itself
    //   if (enemyCoords[e.id] !== enemyCoords[otherEnemy.id]) {
    //     // Check if there is a collision
    //     var distX = enemyCoords[e.id].x - enemyCoords[otherEnemy.id].x; 
    //     var distY = enemyCoords[e.id].y - enemyCoords[otherEnemy.id].y;
    //     var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    //     if (dist < 20 && !e.collision) {
    //       // If there is a collision, reverse the direction of the ball
    //       reverseEnemyDirection(e);
    //       e.collision = true;
    //     }
    //   }
    // });

    
  });
};

/*------------------------------------------------------------------------------
                START GAME
--------------------------------------------------------------------------------
*/

// Place enemies on board and start the enemies update loop
render(enemies);
playerOne.playerRender(gameBoard);
setInterval(function() {
  checkCollision();
  updateEnemies(enemies);
  render(enemies);
}, 1);

setInterval(function() {
  gameStats.score++;
  updateScore();
}, 500);























