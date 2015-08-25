function Shape(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam, fallDelayParam) {

  // Shape top left block position
  var x = xParam;
  var y = yParam;

  var width  = shapeModel.width;
  var height = shapeModel.height;
  var gameWidth  = gameWidthParam;
  var gameHeight = gameHeightParam;
  
  var xShapeModel = shapeModel.xBlockList;
  var yShapeModel = shapeModel.yBlockList;

  var gameBlockList = gameBlockListParam;

  var blockList = [];
  var bottomBlockIndexList = [];
  var leftBlockIndexList   = [];
  var rightBlockIndexList  = [];

  var fallDelay = fallDelayParam;
  var fallCount = 0;

  var position = 0;
  var UP_POS = 0;
  var RIGHT_POS = 1;
  var DOWN_POS = 2;
  var LEFT_POS = 3;

  var colliding = false;

  // ----------------------------------------------------------------------------------------------------
  //   initialization
  // ----------------------------------------------------------------------------------------------------

  // create blocks in model space and put into blockList
  function createBlockList() {
    for (var blockIndex = 0; blockIndex < SHAPE_BLOCK_COUNT; blockIndex++) {
      var xBlock = xShapeModel[position][blockIndex];
      var yBlock = yShapeModel[position][blockIndex];

      blockList[blockIndex] = new Block(xBlock, yBlock, gameWidth, gameHeight);
    }
  }

  // get block indices where valueParam equals the values of listParam 
  function getBlockIndexList(value, list) {
    var indices = [];
    var i = 0;

    for (var blockIndex = 0; blockIndex < SHAPE_BLOCK_COUNT; blockIndex++) {
      if (value === list[blockIndex]) {
        indices[i] = blockIndex;
        i++;
      }
    }
    return indices;
  }

  function getBlockIndexAtBottom(indices) {
    for (var yIndex = height-1; yIndex >= 0; yIndex--) {
      for (var i = 0; i < indices.length; i++) {
        if (yIndex == yShapeModel[position][indices[i]]) {
          return indices[i];
        }
      }
    }
    return -1;
  }

  function getBlockIndexAtLeft(indices) {
    for (var xIndex = 0; xIndex < width; xIndex++) {
      for (var i = 0; i < indices.length; i++) {
        if (xIndex == xShapeModel[position][indices[i]]) {
          return indices[i];
        }
      }
    }
    return -1;
  }

  function getBlockIndexAtRight(indices) {
    for (var xIndex = width-1; xIndex >= 0; xIndex--) {
      for (var i = 0; i < indices.length; i++) {
        if (xIndex == xShapeModel[position][indices[i]]) {
          return indices[i];
        }
      }
    }
    return -1;
  }

  function createBlockIndexList() {
    bottomBlockIndexList = [];
    // create bottomBlockIndexList
    for (var xIndex = 0; xIndex < width; xIndex ++) {
      var indices = getBlockIndexList(xIndex, xShapeModel[position]);
      bottomBlockIndexList[xIndex] = getBlockIndexAtBottom(indices);
    }

    leftBlockIndexList  = [];
    rightBlockIndexList = [];
    // create left and right blockIndexList
    for (var yIndex = 0; yIndex < height; yIndex++) {
      var indices = getBlockIndexList(yIndex, yShapeModel[position]);
      leftBlockIndexList[yIndex]  = getBlockIndexAtLeft(indices);
      rightBlockIndexList[yIndex] = getBlockIndexAtRight(indices);
    }
  }

  function init() {
    createBlockList();
    createBlockIndexList();
  }

  init();

  this.update = function() {
    for (var i = 0; i < SHAPE_BLOCK_COUNT; i++) {
      var block = blockList[i];
      block.setX(x + xShapeModel[position][i]);
      block.setY(y + yShapeModel[position][i]);
    }

    if (fallCount < fallDelay) {
      fallCount ++;
    }
    else {
      fallCount = 0;
      this.moveDown(1);
    }
  };

  this.render = function(ctx) {
    for (var i in blockList) {
      blockList[i].render(ctx);
    }
  };

  this.moveUp = function(dy) {
    y -= y;
  };

  this.moveDown = function(dx) {
    if (y < gameHeight - height) {
      y += dx;
    }

    if (bottomIsColliding()) {
      colliding = true;
    }
  };

  this.moveLeft = function(dx) {
    if (x > 0 && !leftIsColliding()) {
      x -= dx;
    }
  };

  this.moveRight = function(dx) {
    if (x < gameWidth - width && !rightIsColliding()) {
      x += dx;
    }
  };

  function swapWidthHeight() {
    var temp = width;

    width  = height;
    height = temp;
  }

  this.turnLeft = function() {
    swapWidthHeight();
    if (position > 0) {
      position --;
    }
    else {
      position = 3;
    }

    // prevent shape from passing the game border
    if (x + width > gameWidth) {
      x --;
    }

    createBlockIndexList(); 
  };

  this.turnRight = function() {
    swapWidthHeight();
    if (position < 3) {
      position++;
    }
    else {
      position = 0;
    }

    // prevent shape from passing the game border
    if (x + width > gameWidth) {
      x --;
    } 

    createBlockIndexList();
  };

  function bottomIsColliding() {
    // check if there is a block under the shape
    for (i in bottomBlockIndexList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          if (blockList[bottomBlockIndexList[i]].bottomIsColliding(gameBlockList[row][j])) {
            console.log('bottom colliding');
            return true;
          }
        }
      }
    }

    // check if the shape is at the bottom
    return y === gameHeight - height;
  };

  function leftIsColliding() {
    // check if there is a block to the left of the shape
    for (i in leftBlockIndexList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          if (blockList[leftBlockIndexList[i]].leftIsColliding(gameBlockList[row][j])) {
            console.log('left colliding');

            return true;
          }
        }
      }
    }
  };

  function rightIsColliding() {
    // check if there is a block to the right of the shape
    for (i in rightBlockIndexList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          if (blockList[rightBlockIndexList[i]].rightIsColliding(gameBlockList[row][j])) {
            console.log('right colliding');
            
            return true;
          }
        }
      }
    }
  };

  this.isColliding = function() {
    return colliding;
  };

  this.getBlockList = function() {
    return blockList;
  };

}