function Block(xParam, yParam, gameWidthParam, gameHeightParam) {
  var size = BLOCK_SIZE;
  
  var x = xParam;
  var y = yParam;

  var gameWidth  = gameWidthParam;
  var gameHeight = gameHeightParam;

  this.update = function() {

  };

  this.render = function(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x * size, y * size, size, size);
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
    console.log("x: "+x+" y: "+y)
    return y <= 0;
  }

  this.getX = function() {
    return x;
  };
  this.setX = function(xNew) {
    x = xNew;
  };
  this.getY = function() {
    return y;
  };
  this.setY = function(yNew) {
    y = yNew;
  };
};