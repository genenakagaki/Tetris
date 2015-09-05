// Axis Aligned Rectangle
function AARect(x, y, width, height, color) {
  var x = x;
  var y = y;

  var width  = width;
  var height = height;

  var color = color;

  this.render = function(ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  this.x = function() {
    return x;
  };
  this.y = function() {
    return y;
  };

  this.setX = function(xParam) {
    x = xParam;
  };
  this.setY = function(yParam) {
    y = yParam;
  };
}