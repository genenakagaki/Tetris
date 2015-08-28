function Tetris() {
  // get canvas
  var canvas = document.getElementById("tetris");
  var ctx    = canvas.getContext("2d");
  canvas.width  = 512;
  canvas.height = 480;

  var width  = 10;
  var height = 20;

  var gameInterval;
  var paused   = false;
  var gameOver = false;

  var key;

  var fallCount = 0;
  var fallDelay = 50;

  var score = 0;

  var shape = new Shape(shapeModelList[utils.random(0, 6)], 3, -4, width, height, blockList, fallDelay);
  var blockList = [];
  for (var i = 0; i < height; i ++) { 
    blockList[i] = [];
  }

  this.run = function() {
    gameLoop();
  };

  function stop() {
    clearInterval(gameInterval);
    console.log("stop");
  }

  function pause() {
    paused = !paused;
    console.log('paused');
  }


  // --------------------------------------------------------------------------------
  //   Key listener
  // --------------------------------------------------------------------------------
  
  // System input
  var stopPressed = false;
  var pausePressed = false;

  // Game input
  var upPressed        = false;
  var downPressed      = false;
  var leftPressed      = false;
  var rightPressed     = false;
  var bottomPressed    = false;
  var turnRightPressed = false;
  var turnLeftPressed  = false;

  window.onkeyup = function(e) {
    key = e.keyCode;
    if (key === 27) { // ESC
      stopPressed = true;
    }
    if (key === 80) { // P
      pausePressed = true;
    }
    
    if (key === 32) { // Space
      bottomPressed = true;
    }
    if (key === 81) { // Q
      turnLeftPressed = true;
    }
    if (key === 69) { // E
      turnRightPressed = true;
    }
  };

  window.onkeydown = function(e) {
    key = e.keyCode;
    if (key === 87) { // W
      upPressed = true;
    }
    if (key === 65) { // A
      leftPressed = true;
    }
    if (key === 83) { // S
      downPressed = true;
    }
    if (key === 68) { // D
      rightPressed = true;
    }
  }

  function checkSystemInput() {
    if (stopPressed) {
      stop();
      stopPressed = false;
    }
    if (pausePressed) {
      pause();
      pausePressed = false;
    }
  }

  function checkGameInput() {
    if (upPressed) {
      shape.turnRight(1);
      upPressed = false;
    }
    if (downPressed) {
      shape.moveDown(1);
      downPressed = false;
    }
    if (leftPressed) {
      shape.moveLeft(1);
      leftPressed = false;
    }
    if (rightPressed) {
      shape.moveRight(1);
      rightPressed = false;
    }
    if (bottomPressed) {
      shape.moveToBottom();
      bottomPressed = false;
    }
    if (turnLeftPressed) {
      shape.turnLeft();
      turnLeftPressed = false;
    }
    if (turnRightPressed) {
      shape.turnRight();
      turnRightPressed = false;
    }
  }
  
  function lineIsComplete(y) {
    return blockList[y].length === width;
  }

  function update() {
    checkSystemInput();
    
    if (paused) {

    }
    else {
      checkGameInput();

      var linesCompleted = 0;

      // shape
      shape.update();

      if (shape.isColliding()) {
        console.log('colliding')
        // save the location of the blocks in shape
        var shapeBlockList = shape.getBlockList();
        for (i in shapeBlockList) {
          var block = shapeBlockList[i];
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
          else if (block.isAtTop()) {
            console.log("GMAEOVER")
            gameOver = true;
            pause();
          }
        }

        score += linesCompleted * 100;

        fallDelay = 50 - linesCompleted * 2;

        shape = new Shape(shapeModelList[utils.random(0, 6)], 3, -4, width, height, blockList, fallDelay);
      }
    }
  };5
  function render() {
    // clear canvas
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width * BLOCK_SIZE, (height) * BLOCK_SIZE);

    ctx.fillStyle = "#FFFFFF";
    ctx.font   = "15px Arial";
    ctx.fillText("Score: " + score, 15, 15);

    shape.render(ctx);
    var blockRowCount = blockList.length;
    for (var i = 0; i < blockRowCount; i++) {
      var blockCount = blockList[i].length;
      for (var j = 0; j < blockCount; j++) {
        blockList[i][j].render(ctx);
      }
    }

    if (gameOver) {
      ctx.fillStyle = "#142034";
      ctx.font = "50px Arial";
      ctx.fillText("Game Over", 50, 50);
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

  
}

new Tetris().run();