function StartMenu(x, y, width, height) {
  var x = x;
  var y = y;

  var width  = width;
  var height = height;

  var startButton     = new Button(x +10, y +40,  width -20, 30, "Start");
  var optionButton    = new Button(x +10, y +80,  width -20, 30, "Option");
  var highScoreButton = new Button(x +10, y +120, width -20, 30, "High Score");

  this.update = function() {

  }
  
  this.render = function(ctx) {
    ctx.fillStyle = "#008800";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "25px arial";
    ctx.fillText("Tetris", x + 30, y + 30);

    startButton.render(ctx);
    optionButton.render(ctx);
    highScoreButton.render(ctx);
  };

  this.startButton = function() {
    return startButton;
  };

  this.optionButton = function() {
    return optionButton;
  };

  this.highScoreButton = function() {
    return highScoreButton;
  };

  this.resumeWidth = function() {
    return resume.width();
  };

  this.setHover = function(boolean) {
    startButton.setHover(boolean);
    optionButton.setHover(boolean);
    highScoreButton.setHover(boolean);
  }
}