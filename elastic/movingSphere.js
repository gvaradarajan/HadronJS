
var Vector = require('../vector.js');
var Constants = require('../config_constants.js');

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
  creationParams.vel = new Vector(Math.random() * 12, Math.random() * 12);
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

  debugger

};



module.exports = movingSphere;
