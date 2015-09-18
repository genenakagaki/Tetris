function Shape(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam) {
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
      var xBlock = xShapeModel[position][blockIndex] + x;
      var yBlock = yShapeModel[position][blockIndex] + y;

      blockList[blockIndex] = new Block(xBlock, yBlock, gameWidth, gameHeight, shapeModel.color);
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

  function translateShape() {
    for (var i = 0; i < SHAPE_BLOCK_COUNT; i++) {
      var block = blockList[i];
      block.setX(x + xShapeModel[position][i]);
      block.setY(y + yShapeModel[position][i]);
    }
  }

  this.render = function(ctx) {
    translateShape();

    for (var i in blockList) {
      blockList[i].render(ctx);
    }
  };

  // --------------------------------------------------------------------------------
  //   Movement
  // --------------------------------------------------------------------------------
  this.moveUp = function(dy) {
    y -= y;
  };

  this.moveDown = function(dy) {
    if (!colliding) {
      y += dy;
      
      if (bottomIsColliding()) {
        colliding = true;
      }
    }
  };

  this.moveLeft = function(dx) {
    if (x > 0 && !this.leftIsColliding()) {
      x -= dx;
    }

    // detect bottom collision when shape slided to left
    if (colliding) {
      if (!bottomIsColliding()) {
        colliding = false;
        lockCount = 0;
      }
    }
  };

  this.moveRight = function(dx) {
    if (x < gameWidth - width && !this.rightIsColliding()) {
      x += dx;
    }

    // detect bottom collision when shape slided to right
    if (colliding) {
      if (!bottomIsColliding()) {
        colliding = false;
        lockCount = 0;
      }
    }
  };

  this.moveToBottom = function() {
    while (!colliding) {
      this.moveDown(1);
    }

    locked = true;
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
    var xOverflow = x + width - gameWidth;
    if (xOverflow > 0) {
      x -= xOverflow;
    }
    var yOverflow = y + height - gameHeight;
    if (yOverflow > 0) {
      y -= yOverflow;
    }

    createBlockIndexList();

    if (isOverlapping()) {
      this.turnRight();
    } 
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
    var xOverflow = x + width - gameWidth;
    if (xOverflow > 0) {
      x -= xOverflow;
    }
    var yOverflow = y + height - gameHeight;
    if (yOverflow > 0) {
      y -= yOverflow;
    }

    createBlockIndexList();

    if (isOverlapping()) {
      this.turnLeft();
    }
  };

  function isOverlapping() {
    translateShape();

    // check if there is a block under the shape
    for (i in blockList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          // console.log("row: " + gameBlockList[row][j].getX() + "," + gameBlockList[row][j].getY());
          if (blockList[i].isOverlapping(gameBlockList[row][j])) {
            return true;
          }
        }
      }
    }
  }

  function bottomIsColliding() {
    translateShape();

    // check if there is a block under the shape
    for (i in bottomBlockIndexList) {
      for (row in gameBlockList) {
        // console.log(gameBlockList[row]);
        for (j in gameBlockList[row]) {
          if (blockList[bottomBlockIndexList[i]].bottomIsColliding(gameBlockList[row][j])) {
            return true;
          }
        }
      }
    }

    // check if the shape is at the bottom
    return y === gameHeight - height;
  };

  this.leftIsColliding = function() {
    translateShape();
    // check if there is a block to the left of the shape
    for (i in leftBlockIndexList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          if (blockList[leftBlockIndexList[i]].leftIsColliding(gameBlockList[row][j])) {
            return true;
          }
        }
      }
    }
  };

  this.rightIsColliding = function() {
    translateShape();
    // check if there is a block to the right of the shape
    for (i in rightBlockIndexList) {
      for (row in gameBlockList) {
        for (j in gameBlockList[row]) {
          if (blockList[rightBlockIndexList[i]].rightIsColliding(gameBlockList[row][j])) {
            
            return true;
          }
        }
      }
    }
  };

  // --------------------------------------------------------------------------------
  //   Getters
  // --------------------------------------------------------------------------------
  this.x = function() {
    return x;
  };

  this.y = function() {
    return y;
  };

  this.isColliding = function() {
    return colliding;
  };

  this.getBlockList = function() {
    return blockList;
  };

  // --------------------------------------------------------------------------------
  //   Setters
  // --------------------------------------------------------------------------------
  this.setY = function(newY) {
    y = newY;
  };

  this.setColliding = function(boolean) {
    colliding = boolean;
  };

  this.setColor = function(color) {
    for (i in blockList) {
      blockList[i].setColor(color);
    }
  };

  this.setBorderColor = function(borderColor) {
    for (i in blockList) {
      blockList[i].setBorderColor(borderColor);
    }
  }
}
