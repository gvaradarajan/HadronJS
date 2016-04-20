
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

movingSphere.prototype.move = function (coeffFriction, otherObjs) {
  this.radius = 20;
  var that = this;
  otherObjs.forEach(function (obj) {
    if (that.isCollidedWith(obj) && !that.equals(obj)) {
      if (that.isGlancingWith(obj)) {
        that.handleGlancingCollision(obj);
      }
      else {
        if (obj.isStationary()) {
          that.handleStationaryCollision(obj);
        }
        else {
          that.handleCollision(obj);
        }
      }
    }
  });
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
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

movingSphere.prototype.isGlancingWith = function (otherObj) {
  var collAngle = _trunc(this.getCollisionAngle(otherObj));
  if (collAngle === _trunc(Math.PI) || collAngle === 0) {
    var connVec = new Vector(this.pos[0] - otherObj.pos[0], this.pos[1] - otherObj.pos[1]);
    var connVecAngle = _trunc(connVec.findTheta());
    if (connVecAngle !== _trunc(Math.PI) && connVecAngle !== 0) {
      return true;
    }
  }
  return false;
};

movingSphere.prototype.handleCollision = function (otherObj) {
  if (this.isStationary()) {
    otherObj.handleStationaryCollision(this);
    return;
  }

  var mass1;
  var mass2;

  if (Constants.CONST_MASS) {
    mass1 = CONST_MASS;
    mass2 = CONST_MASS;
  }
  else {
    mass1 = this.mass;
    mass2 = otherObj.mass;
  }

  if (this.vel[0] === 0 && otherObj.vel[0] === 0) {
    this.bounce(false, true);
    otherObj.bounce(false, true);
    return;
  }

  var collAngle = this.getCollisionAngle(otherObj);
  var angle1 = this.vel.findTheta();
  var angle2 = otherObj.vel.findTheta();
  var thisVel = new Vector(this.vel[0], -this.vel[1]);
  var otherVel = new Vector(otherObj.vel[0], -otherObj.vel[1]);
  // var thisVel = new Vector(this.vel[0], -this.vel[1]);
  // var otherVel = new Vector(otherObj.vel[0], -otherObj.vel[1]);


  this.vel[0] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.cos(collAngle)) * (mass1 - mass2);
  this.vel[0] += 2 * mass2 * thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
  this.vel[1] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.sin(collAngle)) * (mass1 - mass2);
  this.vel[1] += 2 * mass2 * thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));

  this.vel[0] = _trunc(this.vel[0] / (mass1 + mass2));
  this.vel[1] = _trunc(this.vel[1] / (mass1 + mass2));

  otherObj.vel[0] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.cos(collAngle)) * (mass2 - mass1);
  otherObj.vel[0] += 2 * mass1 * otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
  otherObj.vel[1] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.sin(collAngle)) * (mass2 - mass1);
  otherObj.vel[1] += 2 * mass1 * otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));

  otherObj.vel[0] = _trunc(otherObj.vel[0]);
  otherObj.vel[1] = _trunc(otherObj.vel[1]);

//
  // otherObj.vel[1] = -otherObj.vel[1];
  // this.vel[1] = -this.vel[1];
//

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

movingSphere.prototype.handleGlancingCollision = function (otherObj) {
  if (otherObj.isStationary()) {
    otherObj.handleGlancingCollision(this);
    return;
  }


  var resultRotation = this.vel.findTheta();

  var connVec = new Vector(this.pos[0] - otherObj.pos[0], this.pos[1] - otherObj.pos[1]);
  var thisVel = new Vector(this.vel.mag(), 0);
  var collAngle = _trunc(thisVel.getRelativeAngle(connVec));
  var otherDir = connVec.findTheta();
  var otherVel = new Vector(otherObj.vel.mag() * Math.cos(otherDir),
                            otherObj.vel.mag() * Math.sin(otherDir));
  var angle1 = 0;
  var angle2 = Math.PI - collAngle;

  var newThis = new Vector();
  var newOther = new Vector();

  newThis[0] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.cos(collAngle));
  newThis[0] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
  newThis[1] = otherVel.mag() * _trunc(Math.cos(angle2-collAngle)) * _trunc(Math.sin(collAngle));
  newThis[1] += thisVel.mag() * _trunc(Math.sin(angle1-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));

  newThis[0] = _trunc(newThis[0]);
  newThis[1] = _trunc(newThis[1]);

  newOther[0] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.cos(collAngle));
  newOther[0] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.cos(collAngle + (Math.PI / 2)));
  newOther[1] = thisVel.mag() * _trunc(Math.cos(angle1-collAngle)) * _trunc(Math.sin(collAngle));
  newOther[1] += otherVel.mag() * _trunc(Math.sin(angle2-collAngle)) * _trunc(Math.sin(collAngle + (Math.PI / 2)));

  newOther[0] = _trunc(newOther[0]);
  newOther[1] = _trunc(newOther[1]);

  this.vel = newThis.rotate(resultRotation);
  otherObj.vel = newOther.rotate(resultRotation);

  this.vel[1] = -this.vel[1];
  otherObj.vel[1] = -otherObj.vel[1];

};



module.exports = movingSphere;
