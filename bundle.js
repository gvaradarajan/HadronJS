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
	
	var newOptions = {
	  FRICTION_COEFF: 0.0094,
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
	  this.radius = settings.radius;
	  this.color = settings.color;
	};
	
	movingSphere.createRandom = function (otherSpheres) {
	  var resultSphere;
	  var creationParams = {};
	  creationParams.color = "#FF0000";
	  creationParams.pos = [(Constants.DIM_X - 42) * Math.random() + 21,
	                        (Constants.DIM_Y - 42) * Math.random() + 21];
	  creationParams.vel = new Vector(Math.random() * 8, Math.random() * 8);
	  creationParams.radius = 20;
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
	  var that = this;
	  // debugger
	  // otherObjs.forEach(function (obj) {
	  //   if (that.isCollidedWith(obj) && !that.equals(obj)) {
	  //     that.handleCollision(obj);
	  //   }
	  // });
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  // debugger
	  if (Constants.WALLS) {
	    this.detectWallCollision();
	  }
	  this.applyFriction();
	};
	
	movingSphere.prototype.detectWallCollision = function () {
	  var Ybound = Constants.DIM_Y - this.radius;
	  var Xbound = Constants.DIM_X - this.radius;
	  var dimXRef = this.pos[0] > Xbound || this.pos[0] < 0 + this.radius;
	  var dimYRef = this.pos[1] > Ybound || this.pos[1] < 0 + this.radius;
	  if (dimXRef || dimYRef) {
	    // debugger
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
	
	movingSphere.prototype.handleCollision = function (otherObj) {
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
	
	
	  var angle1 = thisVel.findTheta();
	  var angle2 = otherVel.findTheta();
	  // debugger
	
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
	
	  this.vel[0] = _trunc(this.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  this.vel[0] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  this.vel[1] = _trunc(this.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  this.vel[1] += thisVel.mag() *
	                 _trunc(Math.sin(angle1 - collAngle)) *
	                 _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[0] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass1 - mass2);
	
	  otherObj.vel[0] += 2 * mass2 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[1] = otherVel.mag() *
	                _trunc(Math.cos(angle2-collAngle)) *
	                (mass1 - mass2);
	
	  otherObj.vel[1] += 2 * mass2 * thisVel.mag() *
	                 _trunc(Math.cos(angle1-collAngle));
	
	  otherObj.vel[0] = _trunc(otherObj.vel[0] / (mass1 + mass2)) * _trunc(Math.cos(collAngle));
	  otherObj.vel[0] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.cos(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = _trunc(otherObj.vel[1] / (mass1 + mass2)) * _trunc(Math.sin(collAngle));
	  otherObj.vel[1] += otherVel.mag() *
	                     _trunc(Math.sin(angle2 - collAngle)) *
	                     _trunc(Math.sin(collAngle + (Math.PI / 2)));
	
	  otherObj.vel[1] = -otherObj.vel[1];
	  this.vel[1] = -this.vel[1];
	
	  this.vel = this.vel.rotate(-resultRotation);
	  otherObj.vel = otherObj.vel.rotate(-resultRotation);
	
	
	
	};
	
	
	
	module.exports = movingSphere;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map