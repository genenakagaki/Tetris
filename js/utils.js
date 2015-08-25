function Utils() {
  this.inherit = function(SubClass, SuperClass) {
    function Surrogate() {};
    Surrogate.prototype = SuperClass.prototype;
    SubClass.prototype = new Surrogate();
  };

  this.random = function(min, max) {
    var range = max - min + 1;
    return Math.floor((Math.random() * range) + min);
  };
};

var utils = new Utils();