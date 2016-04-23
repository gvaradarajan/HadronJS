

var engine = function (options, callback) {
  var Constants = require('./config_constants.js');
  var Vector = require('./vector.js');
  var movingSphere;

  // this.constants = Constants.setConstants(options);
  if (Constants.ELASTIC === true) {
    movingSphere = require('./elastic/movingSphere.js');
  }

  callback(Constants, Vector, movingSphere);

};

var newOptions = {
  FRICTION_COEFF: 0.0054,
  ELASTIC: true,
  WALLS: true,
  CONST_MASS: 50,
  DIM_X: 750,
  DIM_Y: 750
};


engine(newOptions, function (Constants, Vector, movingSphere) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  Constants.setConstants(newOptions);
  // var vel1 = new Vector(0,3);
  // var vel2 = new Vector(0,-3);
  //
  // var newObj = new movingSphere({pos: [500, 40],
  //                                vel: vel1,
  //                                radius: 20,
  //                                color: "#00FF00"});
  // var newObj2 = new movingSphere({pos: [510, 600],
  //                                 vel: vel2,
  //                                 radius: 20,
  //                                 color: "#FF0000"});
  var balls = [];
  // debugger
  while (balls.length < 11) {
    balls.push(movingSphere.createRandom(balls));
  }
  setInterval(function () {
    c.clearRect(0, 0, canvas.width, canvas.height);
    // newObj.draw(c);
    // newObj2.draw(c);
    balls.forEach(function (ball) {
      ball.draw(c);
    });
    var checkedBalls = balls.slice();
    for (var i = 0; i < balls.length; i++) {
      checkedBalls.shift();
      balls[i].move(checkedBalls);
    }
    // newObj.move([newObj2]);
    // newObj2.move([]);
  }, 20);
});

// module.exports = engine;
