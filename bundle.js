/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	
	var engine = function (options, callback) {
	  var Constants = __webpack_require__(1);
	  var Vector = __webpack_require__(2);
	  var movingSphere;
	
	  // this.constants = Constants.setConstants(options);
	  if (Constants.ELASTIC === true) {
	    movingSphere = __webpack_require__(3);
	  }
	
	  callback(Constants, Vector, movingSphere);
	
	};
	
	
	// DEMO: A Basic Illustration of How The Engine Can Be Used
	
	
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
	      if (totalKE === 0) {
	        debugger
	      }
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	var configConstants = {
	  FRICTION_COEFF: 0,
	  ELASTIC: true,
	  GRAVITY: false,
	  CONST_DENSITY: null,
	  CONST_MASS: null,
	  CONST_RADIUS: null,
	  SPACE_DIM: 2,
	  WALLS: true,
	  DIM_X: null,
	  DIM_Y: null
	};
	
	
	configConstants.setConstants = function (options) {
	  if (options === undefined) {
	    return;
	  }
	  Object.keys(this).forEach(function (key) {
	    if (options[key] !== undefined) {
	      this[key] = options[key];
	    }
	  }.bind(this));
	};
	
	module.exports = configConstants;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	var Vector = function (x, y) {
	  this[0] = x;
	  this[1] = y;
	};
	
	var _trunc = function (num) {
	  return parseFloat(num.toFixed(4));
	};
	
	
	Vector.prototype.findTheta = function () {
	  if (this[0] === 0) {
	    if (this[1] > 0) {
	      return Math.PI / 2;
	    }
	    else if (this[1] === 0) {
	      return 0;
	    }
	    else {
	      return -Math.PI / 2;
	    }
	  }
	  if (this[1] === 0) {
	    if (this[0] > 0) {
	      return 0;
	    }
	    else {
	      return Math.PI;
	    }
	  }
	  if (this[0] > 0) {
	    return Math.atan(-this[1] / this[0]);
	  }
	  else {
	    return Math.atan(-this[1] / this[0]) + Math.PI;
	  }
	};
	
	Vector.prototype.scalarProd = function (vec) {
	  return (this[0] * vec[0]) + (this[1] * vec[1]);
	};
	
	Vector.prototype.norm = function () {
	  return Math.pow(this[0], 2) + Math.pow(this[1], 2);
	};
	
	Vector.prototype.mag = function () {
	  return Math.sqrt(this.norm());
	};
	
	Vector.prototype.getRelativeAngle = function (vec) {
	  if (vec.norm() === 0 || this.norm() === 0) {
	    return null;
	  }
	  var denom = (Math.sqrt(this.norm()) * Math.sqrt(vec.norm()));
	  var innerVal = this.scalarProd(vec) / denom;
	  if (_trunc(innerVal) === 1) {
	    if (this.norm() === vec.norm()) {
	      return 0;
	    }
	    return false;
	  }
	  return Math.acos(_trunc(innerVal));
	};
	
	Vector.prototype.unitize = function () {
	  if (this.mag() === 0) {
	    return new Vector(0, 0);
	  }
	  var dir = this.findTheta();
	  var newX = Math.cos(dir);
	  var newY = Math.sin(dir);
	  return new Vector(newX, newY);
	};
	
	Vector.prototype.willIntersect = function (otherVec, thisPos, otherPos) {
	  var denom = (this[1] / this[0]) - (otherVec[1] / otherVec[0]);
	  var x = (otherPos[1] - thisPos[1]) +
	          (this[1] / this[0]) * (thisPos[0]) +
	          (otherVec[1] / otherVec[0]) * (otherPos[0]);
	  if (denom === 0) {
	    return true;
	  }
	  x = x / denom;
	  if (x >= 0) {
	    return true;
	  }
	  return false;
	};
	
	Vector.prototype.rotate = function (angle) {
	  var newX = this[0] * Math.cos(angle) - this[1] * Math.sin(angle);
	  var newY = this[0] * Math.sin(angle) + this[1] * Math.cos(angle);
	  return new Vector(newX, newY);
	};
	
	module.exports = Vector;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	var Vector = __webpack_require__(2);
	var Constants = __webpack_require__(1);
	
	var _trunc = function (num) {
	  return parseFloat(num.toFixed(4));
	};
	
	var movingSphere = function (settings) {
	  this.pos = settings.pos;
	  this.vel = settings.vel;
	  this.mass = settings.mass || Constants.CONST_MASS;
	  this.radius = settings.radius;
	  this.color = settings.color;
	};
	
	movingSphere.createRandom = function (otherSpheres) {
	  var resultSphere;
	  var creationParams = {};
	  var density = Constants.CONST_DENSITY;
	  var radius = (Math.random() * 10) + 10;
	  var mass = Math.pow(radius, 3) * (4/3) * Math.PI * density;
	  creationParams.color = "#FF" + Math.round((Math.random() * 9999));
	  creationParams.pos = [(Constants.DIM_X - 42) * Math.random() + 21,
	                        (Constants.DIM_Y - 42) * Math.random() + 21];
	  creationParams.vel = new Vector(Math.random() * 3, Math.random() * 3);
	  creationParams.radius = radius;
	  creationParams.mass = mass;
	  resultSphere = new movingSphere(creationParams);
	  var invalid = false;
	  for (var i = 0; i < otherSpheres.length; i++) {
	    if (resultSphere.isCollidedWith(otherSpheres[i])) {
	      invalid = true;
	    }
	  }
	  if (invalid) {
	    return movingSphere.createRandom(otherSpheres);
	  }
	  else {
	    // debugger;
	    return resultSphere;
	  }
	};
	
	movingSphere.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
	  ctx.fill();
	};
	
	movingSphere.prototype.equals = function (otherObj) {
	  if (this.pos[0] === otherObj.pos[0] && this.pos[1] === otherObj.pos[1]) {
	    return true;
	  }
	  return false;
	};
	
	movingSphere.prototype.move = function () {
	  var oldVel = Object.assign(Vector, this.vel);
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  if (Constants.WALLS) {
	    this.handleWallCollision();
	  }
	  this.applyFriction();
	  return oldVel;
	};
	
	movingSphere.prototype.undoMove = function (oldVel) {
	  this.pos[0] -= oldVel[0];
	  this.pos[1] -= oldVel[1];
	};
	
	movingSphere.prototype.detectWallCollisionX = function () {
	  var Xbound = Constants.DIM_X - this.radius;
	  var dimXRef = this.pos[0] > Xbound || this.pos[0] < 0 + this.radius;
	  return dimXRef;
	};
	
	movingSphere.prototype.detectWallCollisionY = function () {
	  var Ybound = Constants.DIM_Y - this.radius;
	  var dimYRef = this.pos[1] > Ybound || this.pos[1] < 0 + this.radius;
	  return dimYRef;
	};
	
	movingSphere.prototype.handleWallCollision = function () {
	  var dimXRef = this.detectWallCollisionX();
	  var dimYRef = this.detectWallCollisionY();
	  if (dimXRef || dimYRef) {
	    this.pos[0] -= this.vel[0];
	    this.pos[1] -= this.vel[1];
	    this.bounce(dimXRef, dimYRef);
	  }
	};
	
	movingSphere.prototype.applyFriction = function () {
	  coeffFriction = Constants.FRICTION_COEFF;
	  this.vel[0] = this.vel[0] * Math.sqrt(1 - coeffFriction);
	  this.vel[1] = this.vel[1] * Math.sqrt(1 - coeffFriction);
	};
	
	movingSphere.prototype.bounce = function (bounceX, bounceY) {
	  this.vel[0] = bounceX ? -this.vel[0] : this.vel[0];
	  this.vel[1] = bounceY ? -this.vel[1] : this.vel[1];
	};
	
	movingSphere.prototype.getCollisionAngle = function (otherObj) {
	  return this.vel.getRelativeAngle(otherObj.vel);
	};
	
	movingSphere.prototype.isCollidedWith = function (otherObj) {
	  var distance = new Vector(otherObj.pos[0] - this.pos[0], otherObj.pos[1] - this.pos[1]);
	  if (distance.mag() <= (this.radius + otherObj.radius)) {
	    return true;
	  }
	  return false;
	};
	
	movingSphere.prototype.isStationary = function () {
	  if (this.vel.mag() < 0.07) {
	    return true;
	  }
	  return false;
	};
	
	movingSphere.prototype.handleStationaryCollision = function (stillObj) {
	  if (!this.isStationary()) {
	    stillObj.vel[0] = this.vel[0];
	    stillObj.vel[1] = this.vel[1];
	    this.vel[0] = 0;
	    this.vel[1] = 0;
	  }
	};
	
	movingSphere.prototype.correctOverlap = function (otherObj) {
	  // var thisUnitVel = this.vel.unitize();
	  // var otherUnitVel = otherObj.vel.unitize();
	  var connVec = new Vector(this.pos[0] - otherObj.pos[0],
	                           this.pos[1] - otherObj.pos[1]);
	  while (connVec.mag() <= this.radius + otherObj.radius) {
	    if (!this.detectWallCollisionX() && !this.detectWallCollisionY()) {
	      // this.pos[0] -= thisUnitVel[0];
	      // this.pos[1] -= thisUnitVel[1];
	      this.pos[0] -= this.vel[0];
	      this.pos[1] -= this.vel[1];
	    }
	    if (!otherObj.detectWallCollisionX() && otherObj.detectWallCollisionY()) {
	      otherObj.pos[0] -= otherObj.vel[0];
	      otherObj.pos[1] -= otherObj.vel[1];
	      // otherObj.pos[0] -= otherUnitVel[0];
	      // otherObj.pos[1] -= otherUnitVel[1];
	    }
	    connVec[0] = this.pos[0] - otherObj.pos[0];
	    connVec[1] = this.pos[1] - otherObj.pos[1];
	  }
	};
	
	movingSphere.prototype.kineticEnergy = function () {
	  return this.mass * this.vel.norm() / 2;
	};
	
	
	movingSphere.prototype.handleCollision = function (otherObj) {
	  // this.correctOverlap(otherObj);
	
	  // if (this.vel[0]*otherObj.vel[0] < 0 && this.vel[1]*otherObj.vel[1] < 0) {
	  //   return;
	  // }
	
	  var totalKEbefore = this.kineticEnergy() + otherObj.kineticEnergy();
	
	  var formerThisVel = this.vel;
	  var formerOtherVel = otherObj.vel;
	
	  var connVec = new Vector(this.pos[0] - otherObj.pos[0],
	                           this.pos[1] - otherObj.pos[1]);
	  var resultRotation = connVec.findTheta();
	
	  var mass1;
	  var mass2;
	
	  if (Constants.CONST_MASS) {
	    mass1 = Constants.CONST_MASS;
	    mass2 = Constants.CONST_MASS;
	  }
	  else {
	    mass1 = this.mass;
	    mass2 = otherObj.mass;
	  }
	
	  var collAngle = Math.PI;
	
	  var thisVel = this.vel.rotate(resultRotation);
	  var otherVel = otherObj.vel.rotate(resultRotation);
	
	  // var newThisCoord = new Vector(this.pos[0], this.pos[1]);
	  // var newOtherCoord = new Vector(otherObj.pos[0], otherObj.pos[1]);
	  // newThisCoord = newThisCoord.rotate(resultRotation);
	  // newOtherCoord = newOtherCoord.rotate(resultRotation);
	  // if (!thisVel.willIntersect(otherVel, newThisCoord, newOtherCoord)) {
	  //   return;
	  // }
	
	  var angle1 = thisVel.findTheta();
	  var angle2 = otherVel.findTheta();
	
	  this.vel[0] = thisVel.mag() *
	                _trunc(Math.cos(angle1-collAngle)) *
	                (mass1 - mass2);
	
	  this.vel[0] += 2 * mass2 * otherVel.mag() *
	                 _trunc(Math.cos(angle2-collAngle));
	
	  this.vel[1] = thisVel.mag() *
	                _trunc(Math.cos(angle1-collAngle)) *
	                (mass1 - mass2);
	
	  this.vel[1] += 2 * mass2 * otherVel.mag() *
	                 _trunc(Math.cos(angle2-collAngle));
	
	  this.vel[0] = (this.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  this.vel[0] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  this.vel[1] = (this.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  this.vel[1] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[0] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass2 - mass1);
	
	  otherObj.vel[0] += 2 * mass1 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[1] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass2 - mass1);
	
	  otherObj.vel[1] += 2 * mass1 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[0] = (otherObj.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  otherObj.vel[0] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = (otherObj.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  otherObj.vel[1] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = -otherObj.vel[1];
	  this.vel[1] = -this.vel[1];
	
	  this.vel = this.vel.rotate(-resultRotation);
	  otherObj.vel = otherObj.vel.rotate(-resultRotation);
	
	  var totalKEafter = this.kineticEnergy() + otherObj.kineticEnergy();
	
	  if (Math.abs(Math.round(totalKEafter - totalKEbefore)) > 1) {
	    // debugger
	  }
	
	};
	
	
	
	module.exports = movingSphere;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map