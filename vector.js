
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

Vector.prototype.reflectOffVector = function (v2, mass1, mass2, collAngle) {
  var result = new Vector(0,0);

  var angle1 = this.findTheta();
  var angle2 = v2.findTheta();

  var firstTermThis = (this.mag() *
                       _trunc(Math.cos(angle1-collAngle)) *
                      (mass1 - mass2) +
                      (2 * mass2 * v2.mag() *
                       _trunc(Math.cos(angle2-collAngle)))) / (mass1 + mass2);

  result[0] = firstTermThis * _trunc(Math.cos(collAngle));

  result[0] += this.mag() *
                 _trunc(Math.sin(angle1 - collAngle)) *
                 _trunc(Math.cos(collAngle + (Math.PI / 2)));

  result[1] = firstTermThis * _trunc(Math.sin(collAngle));

  result[1] += this.mag() *
                 _trunc(Math.sin(angle1 - collAngle)) *
                 _trunc(Math.sin(collAngle + (Math.PI / 2)));

   result[1] = -result[1];

  return result;
};

module.exports = Vector;
