function Block(xParam, yParam, gameWidthParam, gameHeightParam, colorParam) {
  var size = BLOCK_SIZE;
  
  var x = xParam;
  var y = yParam;

  var gameWidth  = gameWidthParam;
  var gameHeight = gameHeightParam;

  var color = colorParam;
  var borderColor = "#000000";

  this.update = function() {

  };

  this.render = function(ctx) {
    var xRendPos = x * size;
    var yRendPos = y * size;
    ctx.fillStyle = borderColor;
    ctx.fillRect(xRendPos, yRendPos, size, size);
    ctx.fillStyle = color;
    ctx.fillRect(xRendPos + 1, yRendPos + 1, size - 2, size - 2);
  };

  this.moveDown = function(dy) {
    y += dy;
  };

  this.bottomIsColliding = function(block) {
    return ( 
      (x === block.getX())   &&
      (y === block.getY()-1)
    );
  };

  this.leftIsColliding = function(block) {
    return ( 
      (x === block.getX()+1) &&
      (y === block.getY())     
    );
  };

  this.rightIsColliding = function(block) {
    return (
      (x === block.getX()-1) &&
      (y === block.getY())
    );
  };

  this.isOverlapping = function(block) {
    return ( (x === block.getX()) &&
             (y === block.getY()) );
  };

  this.isAtTop = function(block) {
    return y <= 0;
  }

  // --------------------------------------------------------------------------------
  //   Getters
  // --------------------------------------------------------------------------------
  this.getX = function() {
    return x;
  };

  this.getY = function() {
    return y;
  };

  // --------------------------------------------------------------------------------
  //   Setters
  // --------------------------------------------------------------------------------
  this.setX = function(xNew) {
    x = xNew;
  };

  this.setY = function(yNew) {
    y = yNew;
  };

  this.setColor = function(newColor) {
    color = newColor;
  };

  this.setBorderColor = function(newBorderColor) {
    borderColor = newBorderColor;
  }
};