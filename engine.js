

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
  FRICTION_COEFF: 0.02,
  ELASTIC: true,
  WALLS: true,
  CONST_MASS: 50,
  DIM_X: 750,
  DIM_Y: 750
};

// FRICTION_COEFF: 0.0054;

engine(newOptions, function (Constants, Vector, movingSphere) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  Constants.setConstants(newOptions);
  // var vel1 = new Vector(0,3);
  // var vel2 = new Vector(0,-3);
  //
  // var newObj2 = new movingSphere({pos: [510, 600],
  //                                 vel: vel2,
  //                                 radius: 20,
  //                                 color: "#FF0000"});
  var balls = [];
  // debugger
  var vel1 = new Vector(0, 0);
  var vel2 = new Vector(10, -10);
  var stillBall = new movingSphere({pos: [300, 300],
    vel: vel1,
    radius: 20,
    color: "#FF0000"});
  var movingBall = new movingSphere({pos: [200, 400],
    vel: vel2,
    radius: 20,
    color: "#00FF00"});
  balls.push(stillBall);
  balls.push(movingBall);
  // while (balls.length < 20) {
  //   balls.push(movingSphere.createRandom(balls));
  // }
  setInterval(function () {
    c.clearRect(0, 0, canvas.width, canvas.height);
    // newObj.draw(c);
    // newObj2.draw(c);
    balls.forEach(function (ball) {
      ball.draw(c);
    });
    var uncheckedBalls = balls.slice();
    for (var i = 0; i < balls.length; i++) {
      uncheckedBalls.shift();
      for (var j = 0; j < uncheckedBalls.length; j++) {
        if (balls[i].isCollidedWith(uncheckedBalls[j]) && !balls[i].equals(uncheckedBalls[j])) {
          balls[i].handleCollision(uncheckedBalls[j]);
        }
      }
    }
    balls.forEach(function (ball) {
      ball.move();
    });
    // newObj.move([newObj2]);
    // newObj2.move([]);
  }, 20);
});

// module.exports = engine;
