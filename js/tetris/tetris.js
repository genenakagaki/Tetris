function Tetris() {
  var canvas = document.getElementById("tetris");
  var ctx    = canvas.getContext("2d");

  var width;
  var height;

  var gameInterval;
  var started  = false;
  var paused   = true;
  var isGameOver = false;

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

  var startMenu;
  var pauseMenu;
  var gameOverMenu;

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

  function gameOver() {
    pause();
    isGameOver = true;
    gameOverMenu.setScore(score);
  }

  function init() {
    width  = 10;
    height = 20;

    canvas.width  = BLOCK_SIZE * width;
    canvas.height = BLOCK_SIZE * height;

    pauseMenu    = new PauseMenu(canvas.width/2 - 75,    canvas.height/2 - 150, 150, 175);
    startMenu    = new StartMenu(canvas.width/2 - 75,    canvas.height/2 - 150, 150, 175);
    gameOverMenu = new GameOverMenu(canvas.width/2 - 75, canvas.height/2 - 150, 150, 175);
  }

  function restart() {
    document.getElementsByTagName("audio")[0].play();
    blockList = [];
    for (var i = 0; i < height; i ++) { 
      blockList[i] = [];
    }

    createNewShape();

    isGameOver = false;
    started = true;
  }

  // --------------------------------------------------------------------------------
  //   Key Listener
  // --------------------------------------------------------------------------------
  window.onkeyup = function(e) {
    key = e.keyCode;
      
    // System input
    if (started) {
      if (key === 27) { // ESC
        pauseAction = true;
      }
      if (key === 80) { // P
        pauseAction = true;
      }
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

    if (!paused) {
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
  canvas.addEventListener('mousemove', function(event) {
    if (paused) {
      var xMouse = event.pageX - canvas.offsetLeft;
      var yMouse = event.pageY - canvas.offsetTop;
      if (!started) {
        if (startMenu.startButton().contains(xMouse, yMouse)) {
          startMenu.startButton().setHover(true);
        }
        else if (startMenu.optionButton().contains(xMouse, yMouse)) {
          startMenu.optionButton().setHover(true);
        }
        else if (startMenu.highScoreButton().contains(xMouse, yMouse)) {
          startMenu.highScoreButton().setHover(true);
        }
        else {
          startMenu.setHover(false);
        }
      }
      else if (isGameOver) {
        if (gameOverMenu.restartButton().contains(xMouse, yMouse)) {
          gameOverMenu.restartButton().setHover(true);
        }
        else if (gameOverMenu.highScoreButton().contains(xMouse, yMouse)) {
          gameOverMenu.highScoreButton().setHover(true);
        }
        else {
          gameOverMenu.setHover(false);
        }
      }
      else {
        if (pauseMenu.resumeButton().contains(xMouse, yMouse)) {
          pauseMenu.resumeButton().setHover(true);
        }
        else if (pauseMenu.restartButton().contains(xMouse, yMouse)) {
          pauseMenu.restartButton().setHover(true);
        }
        else if (pauseMenu.quitButton().contains(xMouse, yMouse)) {
          pauseMenu.quitButton().setHover(true);
        }
        else {
          pauseMenu.setHover(false);
        }
      }
    }
  }, false);

  canvas.addEventListener('click', function(event) {
    if (paused) {
      var xMouse = event.pageX - canvas.offsetLeft;
      var yMouse = event.pageY - canvas.offsetTop;
      if (!started) {
        if (startMenu.startButton().contains(xMouse, yMouse)) {
          restart();
          pause();
        }
        else if (startMenu.optionButton().contains(xMouse, yMouse)) {

        }
      }
      else if (isGameOver) {
        if (gameOverMenu.restartButton().contains(xMouse, yMouse)) {
          restart();
          pause();
        }
      }
      else {
        if (pauseMenu.resumeButton().contains(xMouse, yMouse)) {
          pause();
        }
        else if (pauseMenu.restartButton().contains(xMouse, yMouse)) {
          restart();
          pause();
        }
        else if (pauseMenu.quitButton().contains(xMouse, yMouse)) {
          started = false;
        }
      }
    }
  }, false);

  function lineIsComplete(y) {
    return blockList[y].length === width;
  }

  function createNewShape() {
    var shapeModel = shapeModelList[utils.random(0, 6)];
    shape = new FallingShape(shapeModel, 3, - shapeModel.height, width, height, blockList, fallDelay);
  }

  function update() {
    checkSystemInput();
    
    if (paused) {
    }
    else if (started) {
      checkGameInput(shape);

      var linesCompleted = 0;

      // shape
      shape.update();

      if (shape.isLocked()) {
        // save the location of the blocks in shape
        var shapeBlockList = shape.getBlockList();
        for (i in shapeBlockList) {
          var block = shapeBlockList[i];

          if (block.isAtTop()) {
            gameOver();
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
              console.log("line is complete: " +yShift)
              while (yShift >= 1) {
                var blockListToShift = blockList[yShift -1];
                blockList[yShift] = blockListToShift;
                console.log(blockListToShift)
                for (j in blockList[yShift]) {
                  blockList[yShift][j].moveDown(1);
                }
                yShift--;
              }
              blockList[0] = [];
              console.log(JSON.stringify(blockList));
            }
          }
        }

        if (linesCompleted != 0) {
          score += linesCompleted * 200 + Math.pow(5, linesCompleted);
        }

        if (score > 500) {
          fallDelay = 10;
        }
        if (score > 400) {
          fallDelay = 20;
        }
        if (score > 300) {
          fallDelay = 30;
        }
        if (score > 200) {
          fallDelay = 40;
        }

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

    if (started) {
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
    }

    if (paused) {
      if (!started) {
        startMenu.render(ctx);
      }
      else if (isGameOver) {
        gameOverMenu.render(ctx);
      }
      else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, width * BLOCK_SIZE, height * BLOCK_SIZE);

        pauseMenu.render(ctx);
      }
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
}

new Tetris().run();
