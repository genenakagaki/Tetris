function ShapeShadow(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam) {
  var shape = new Shape(shapeModel, xParam, yParam, gameWidthParam, gameHeightParam, gameBlockListParam)

  function moveToBottom() {
    while (!shape.isColliding()) {
      shape.moveDown(1);
    }
  }

  function init() {
    shape.setColor("#222222");
    shape.setBorderColor(shapeModel.color);
    moveToBottom();
  }

  init();

  this.render = function(ctx) {
    shape.render(ctx);
  }

  this.moveLeft = function(dx, fallingY) {
    shape.setY(fallingY);
    shape.moveLeft(dx);
    moveToBottom();
  };

  this.moveRight = function(dx, fallingY) {
    shape.setY(fallingY);
    shape.moveRight(dx);
    moveToBottom();
  };

  this.turnLeft = function(fallingY) {
    shape.setY(fallingY);
    shape.turnLeft();
    shape.setColliding(false);
    moveToBottom();
  };

  this.turnRight = function(fallingY) {
    shape.setY(fallingY);
    shape.turnRight();
    shape.setColliding(false);
    moveToBottom();
  };
}