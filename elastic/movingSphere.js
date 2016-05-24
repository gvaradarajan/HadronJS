
var Vector = require('../vector.js');
var Util = require('../util/util.js');
var Constants = require('../config_constants.js');

var _trunc = function (num) {
  return parseFloat(num.toFixed(4));
};

var _randomParams = function () {
  var creationParams = {};
  var density = Constants.CONST_DENSITY;
  var radius = (Math.random() * 15) + 10;
  creationParams.color = _randomColor();
  creationParams.pos = _randomPos();
  creationParams.vel = new Vector(Math.random() * 7, Math.random() * 7);
  creationParams.radius = radius;
  creationParams.mass = Math.pow(radius, 3) * (4/3) * Math.PI * density;
  return creationParams;
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
  var creationParams = Util.randomParams();
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
  var distance = new Vector(otherObj.pos[0] - this.pos[0],
                            otherObj.pos[1] - this.pos[1]);
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


movingSphere.prototype.kineticEnergy = function () {
  return this.mass * this.vel.norm() / 2;
};


movingSphere.prototype.handleCollision = function (otherObj) {

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

  this.vel = thisVel.reflectOffVector(otherVel, mass1, mass2, collAngle);

  otherObj.vel = otherVel.reflectOffVector(thisVel, mass2, mass1, collAngle);

  this.vel = this.vel.rotate(-resultRotation);
  otherObj.vel = otherObj.vel.rotate(-resultRotation);

};



module.exports = movingSphere;
