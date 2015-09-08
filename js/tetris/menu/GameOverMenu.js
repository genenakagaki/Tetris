function GameOverMenu(x, y, width, height) {
  var x = x;
  var y = y;

  var width  = width;
  var height = height;

  var score;

  var restartButton   = new Button(x +10, y +90,  width -20, 30, "Restart");
  var highScoreButton = new Button(x +10, y +130, width -20, 30, "High Score");

  this.update = function() {

  }
  
  this.render = function(ctx) {
    ctx.fillStyle = "#008800";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "25px arial";
    ctx.fillText("Game Over", x + 10, y + 30);
    ctx.fillText("Score: "+ score, x + 10, y + 60);

    restartButton.render(ctx);
    highScoreButton.render(ctx);
  };

  // --------------------------------------------------------------------------------
  //   Getters
  // --------------------------------------------------------------------------------
  this.restartButton = function() {
    return restartButton;
  };

  this.highScoreButton = function() {
    return highScoreButton;
  };


  // --------------------------------------------------------------------------------
  //   Setters
  // --------------------------------------------------------------------------------
  this.setScore = function(newScore) {
    score = newScore;
  };

  this.setHover = function(boolean) {
    restartButton.setHover(boolean);
    highScoreButton.setHover(boolean);
  }
}