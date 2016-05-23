

var engine = function (options, callback) {
  var Constants = require('./config_constants.js');
  var Vector = require('./vector.js');
  var movingSphere;


  if (Constants.ELASTIC === true) {
    movingSphere = require('./elastic/movingSphere.js');
  }

  callback(Constants, Vector, movingSphere);

};

// DEMO: A Basic Illustration of How The Engine Can Be Used. Delete the code
//below and provide your own callback to the engine.


var newOptions = {
  FRICTION_COEFF: 0,
  ELASTIC: true,
  WALLS: true,
  // CONST_MASS: 50,
  CONST_DENSITY: 0.00025,
  DIM_X: 750,
  DIM_Y: 750
};

engine(newOptions, function (Constants, Vector, movingSphere) {
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  Constants.setConstants(newOptions);
  var balls = [];
  while (balls.length < 20) {
    balls.push(movingSphere.createRandom(balls));
  }
  var runSimFrame = function () {
    c.clearRect(0, 0, canvas.width, canvas.height);
    var totalKE = 0;
    var mass = arguments[0].CONST_MASS;
    balls.forEach(function (ball) {
      ball.draw(c);
      totalKE += ball.mass * ball.vel.norm();
    });
    totalKE = totalKE / 2;
    document.getElementById('kE').innerHTML = "Total KE of System: " + Math.round(totalKE);
    var uncheckedBalls = balls.slice();
    for (var i = 0; i < balls.length; i++) {
      balls[i].move();
      uncheckedBalls.shift();
      for (var j = 0; j < uncheckedBalls.length; j++) {
        if (balls[i].isCollidedWith(uncheckedBalls[j]) && !balls[i].equals(uncheckedBalls[j])) {
          balls[i].handleCollision(uncheckedBalls[j]);
        }
      }
    }
  };
  var sim = setInterval(runSimFrame.bind(this, Constants), 20);
  var restart = function () {
    clearInterval(sim);
    balls = [];
    while (balls.length < 20) {
      balls.push(movingSphere.createRandom(balls));
    }
    var friction = parseFloat(document.getElementById("friction").value);
    Constants.FRICTION_COEFF = friction;
    sim = setInterval(runSimFrame.bind(this, Constants), 20);
  };
  document.getElementById("restart").addEventListener("click", restart);
});

// module.exports = engine;
