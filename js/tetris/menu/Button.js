function Button(x, y, width, height, text) {
  var x = x;
  var y = y;

  var width  = width;
  var height = height;

  var text = text;

  var hover = false;

  this.render = function(ctx) {
    ctx.fillStyle = "#FFFF88";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#FFFFFF";
    if (hover) {
      ctx.fillStyle = "#FF0000";
    }
    ctx.fillRect(x +1, y +1, width -2, height -2);

    ctx.fillStyle = "#000000";
    ctx.font = "20px arial";
    ctx.fillText(text, x +12, y +22);
  };

  this.contains = function(xParam, yParam) {
    return ((xParam > x)         &&
            (xParam < x + width) &&
            (yParam > y)         &&
            (yParam < y + height)  );
  }

  this.text = function() {
    return text;
  };

  this.x = function() {
    return x;
  };

  this.y = function() {
    return y;
  };

  this.width = function() {
    return width;
  };

  this.height = function() {
    return height;
  };

  this.setHover = function(boolean) {
    hover = boolean;
  }
}