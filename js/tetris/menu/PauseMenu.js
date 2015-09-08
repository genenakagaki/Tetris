function PauseMenu(x, y, width, height) {
  var x = x;
  var y = y;

  var width  = width;
  var height = height;

  var resumeButton  = new Button(x +10, y +40,  width -20, 30, "Resume");
  var restartButton = new Button(x +10, y +80,  width -20, 30, "Restart");
  var quitButton    = new Button(x +10, y +120, width -20, 30, "Quit");

  this.update = function() {

  }
  
  this.render = function(ctx) {
    ctx.fillStyle = "#008800";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "25px arial";
    ctx.fillText("Paused", x + 30, y + 30);

    resumeButton.render(ctx);
    restartButton.render(ctx);
    quitButton.render(ctx);
  };

  this.resumeButton = function() {
    return resumeButton;
  };

  this.restartButton = function() {
    return restartButton;
  };

  this.quitButton = function() {
    return quitButton;
  };

  this.resumeWidth = function() {
    return resume.width();
  };

  this.setHover = function(boolean) {
    resumeButton.setHover(boolean);
    restartButton.setHover(boolean);
    quitButton.setHover(boolean);
  }
}