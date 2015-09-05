function Tetris() {
  var canvas = document.getElementById("tetris");
  var ctx    = canvas.getContext("2d");

  var width;
  var height;

  var gameInterval;
  var paused   = false;
  var gameOver = false;

  // System input
  var stopAction  = false;
  var pauseAction = false;

  // Game input
  var upAction        = false;
  var downAction      = false;
  var leftAction      = false;
  var rightAction     = false;
  var bottomAction    = false;
  var turnLeftAction  = false;
  var turnRightAction = false;

  var pauseMenu;

  var fallCount = 0;
  var fallDelay = 50;

  var score = 0;
  var level = 0;

  var shape;
  var blockList;

  function stop() {
    clearInterval(gameInterval);
    console.log("stop");
  }

  function pause() {
    paused = !paused;
    console.log('paused');
  }

  function init() {
    width  = 10;
    height = 20;

    canvas.width  = BLOCK_SIZE * width;
    canvas.height = BLOCK_SIZE * height;

    pauseMenu = new PauseMenu(20, 20, 150, 200);

    shape = new Shape(shapeModelList[utils.random(0, 6)], 3, -4, width, height, blockList, fallDelay);

    blockList = [];
    for (var i = 0; i < height; i ++) { 
      blockList[i] = [];
    }

  }

  // --------------------------------------------------------------------------------
  //   Key Listener
  // --------------------------------------------------------------------------------
  window.onkeyup = function(e) {
    key = e.keyCode;
      
    // System input
    if (key === 27) { // ESC
      pauseAction = true;
    }
    if (key === 80) { // P
      pauseAction = true;
    }
    
    // Game input
    if (!paused) {
      if (key === 32) { // Space
        bottomAction = true;
      }
      if (key === 81) { // Q
        turnLeftAction = true;
      }
      if (key === 69) { // E
        turnRightAction = true;
      }
    }
  };

  window.onkeydown = function(e) {
    key = e.keyCode;

    if (key === 37) { // LEFT
      leftAction = true;
    }
    if (key === 38) { // UP
      upAction = true;
    }
    if (key === 39) { // RIGHT
      rightAction = true;
    }
    if (key === 40) { // DOWN
      downAction = true;
    }
    if (key === 87) { // W
      upAction = true;
    }
    if (key === 65) { // A
      leftAction = true;
    }
    if (key === 83) { // S
      downAction = true;
    }
    if (key === 68) { // D
      rightAction = true;
    }
  };

  function checkSystemInput() {
    if (stopAction) {
      stop();
      stopAction = false;
    }
    if (pauseAction) {
      pause();
      pauseAction = false;
    }
  };

  function checkGameInput() { 
    if (upAction) {
      shape.turnRight(1);
      upAction = false;
    }
    if (downAction) {
      shape.moveDown(1);
      downAction = false;
    }
    if (leftAction) {
      shape.moveLeft(1);
      leftAction = false;
    }
    if (rightAction) {
      shape.moveRight(1);
      rightAction = false;
    }
    if (bottomAction) {
      shape.moveToBottom();
      bottomAction = false;
    }
    if (turnLeftAction) {
      shape.turnLeft();
      turnLeftAction = false;
    }
    if (turnRightAction) {
      shape.turnRight();
      turnRightAction = false;
    }
  };
  
  // --------------------------------------------------------------------------------
  //   Mouse Listener
  // --------------------------------------------------------------------------------
  canvas.addEventListener('click', function() {
    if (gameOver) {

    }
    else if (paused) {
      var xMouse = event.pageX - canvas.offsetLeft;
      var yMouse = event.pageY - canvas.offsetTop;
      if (pauseMenu.resumeButton().contains(xMouse, yMouse)) {
        pause();
      }
      else if (pauseMenu.restartButton().contains(xMouse, yMouse)) {

      }
      else if (pauseMenu.quitButton().contains(xMouse, yMouse)) {

      }
    }
  }, false);

  function lineIsComplete(y) {
    return blockList[y].length === width;
  }

  function createNewShape() {
    var shapeModel = shapeModelList[utils.random(0, 6)];
    shape = new Shape(shapeModel, 3, -1 - shapeModel.height, width, height, blockList, fallDelay);
  }

  function update() {
    checkSystemInput();
    
    if (paused || gameOver) {

    }
    else {
      checkGameInput(shape);

      var linesCompleted = 0;

      // shape
      shape.update();

      if (shape.isLocked()) {
        console.log('is locked')
        // save the location of the blocks in shape
        var shapeBlockList = shape.getBlockList();
        for (i in shapeBlockList) {
          var block = shapeBlockList[i];

          if (block.isAtTop()) {
            gameOver = true;
            break;
          }
          else {
            var yBlock = block.getY();
            blockList[yBlock].push(block);

            // check if line is complete
            if (lineIsComplete(yBlock)) {
              linesCompleted++;

              // shift down all blocks above line
              var yShift = yBlock;
              while (yShift >= 1) {
                blockList[yShift] = blockList[yShift-1];
                for (j in blockList[yShift]) {
                  blockList[yShift][j].moveDown(1);
                }
                yShift--;
              }
            }
          }


        }

        score += linesCompleted * 100;

        fallDelay = 50 - linesCompleted * 2;

        createNewShape();
      }
    }
  };

  function render() {
    // clear canvas
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width * BLOCK_SIZE, height * BLOCK_SIZE);

    ctx.fillStyle = "#FFFFFF";
    for (i in width) {
      ctx.fillRect(i * BLOCK_SIZE, 0, 2, height * BLOCK_SIZE);
    }

    // score
    ctx.fillStyle = "#FFFFFF";
    ctx.font   = "15px Arial";
    ctx.fillText("Score: " + score, 100, 15);

    shape.render(ctx);
    var blockRowCount = blockList.length;
    for (var i = 0; i < blockRowCount; i++) {
      var blockCount = blockList[i].length;
      for (var j = 0; j < blockCount; j++) {
        blockList[i][j].render(ctx);
      }
    }

    if (gameOver) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "50px Arial";
      ctx.fillText("Game Over", 50, 50);
      stop();
    }
    else if (paused) {
      pauseMenu.render(ctx);
    }
  };
  
  function gameLoop() {
    var UPS = 60; // updates per second
    var tickInterval = 1000/UPS;

    var prevTime = Date.now();
    var currTime;
    var delta;

    var timer = Date.now();
    var updates;
    var frames;

    gameInterval = setInterval(function() {
      currTime = Date.now();
      
      while (currTime - prevTime > tickInterval) {
        update();
        updates++;
        prevTime += tickInterval;
      }

      render();
      frames++;

      if (prevTime - timer > 1000) {
        timer = Date.now();
        // console.log("ups: " + updates + ", fps: " + frames);
        updates = 0;
        frames  = 0;
      }
    }, 10);
  };

  this.run = function() {
    init();
    gameLoop();
  };

  // --------------------------------------------------------------------------------
  //   Getters
  // --------------------------------------------------------------------------------
  this.isPaused = function() {
    return paused;
  };

  this.isGameOver = function() {
    return gameOver;
  };

  this.pauseMenu = function() {
    return pauseMenu;
  };
  
}

new Tetris().run();