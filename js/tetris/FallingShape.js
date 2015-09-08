function FallingShape(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam, fallDelayParam) {
  var shape = new Shape(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam);
  var shapeShadow = new ShapeShadow(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam);
 
  var fallDelay = fallDelayParam;
  var fallCount = 0;

  var lockDelay = fallDelayParam;
  var lockCount = 0;

  var locked = false;

  this.update = function() {
    if (shape.isColliding()) {
      lockCount ++;
      if (lockCount > lockDelay) {
        lockCount = 0;
        locked = true;
      }
    }
    else {
      fallCount ++;
      if (fallCount > fallDelay) {
        fallCount = 0;
        shape.moveDown(1);
      }
    }
  };
  
  this.render = function(ctx) {
    shapeShadow.render(ctx);
    shape.render(ctx);
  };

  // --------------------------------------------------------------------------------
  //   Movement
  // --------------------------------------------------------------------------------
  this.moveDown = function(dy) {
    shape.moveDown(dy);
  };

  this.moveLeft = function(dx) {
    shape.moveLeft(dx);
    shapeShadow.moveLeft(dx, shape.y());
  };

  this.moveRight = function(dx) {
    shape.moveRight(dx);
    shapeShadow.moveRight(dx, shape.y());
  };

  this.moveToBottom = function() {
    shape.moveToBottom();
    locked = true;
  };

  this.turnLeft = function() {
    shape.turnLeft();
    shapeShadow.turnLeft(shape.y());
  };

  this.turnRight = function() {
    shape.turnRight();
    shapeShadow.turnRight(shape.y());
  };

  // --------------------------------------------------------------------------------
  //   Getters
  // --------------------------------------------------------------------------------
  this.getBlockList = function() {
    return shape.getBlockList();
  }
  this.isLocked = function() {
    return locked;
  };
};