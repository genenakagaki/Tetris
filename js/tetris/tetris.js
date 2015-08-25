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

  var shape = new Shape(shapeModelList[utils.random(0, 6)], 0, 0, width, height, blockList, fallDelay);
  var blockList = [];
  for (var i = 0; i < height-1; i ++) {
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

  function lineIsComplete(y) {
    console.log(blockList[y].length);
    return blockList[y].length === width;
  }

  function update() {
    if (paused) {

    }
    else {
      var linesCompleted = 0;

      // shape
      if (shape.isColliding()) {
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
            gameOver = true;
            pause();
          }
        }

        score += linesCompleted * 100;

        fallDelay = 50 - linesCompleted * 2;

        shape = new Shape(shapeModelList[utils.random(0, 6)], 0, 0, width, height, blockList, fallDelay);
      }
      shape.update();
    }
  };

  function render() {
    // clear canvas
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width * BLOCK_SIZE, (height-1) * BLOCK_SIZE);

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

  window.onkeyup = function(e) {
    key = e.keyCode;
    if (key === 27) { // ESC
      stop();
    }
    if (key === 80) { // P
      pause();
    }
    
    if (key === 81) { // Q
      shape.turnLeft();
    }
    if (key === 69) { // R
      shape.turnRight();
    }
  };

  window.onkeydown = function(e) {
    key = e.keyCode;
    if (key === 87) { // W
    }
    if (key === 65) { // A
      shape.moveLeft(1);
    }
    if (key === 83) { // S
      shape.moveDown(1);
    }
    if (key === 68) { // D
      shape.moveRight(1);
    }
  }
}

new Tetris().run();