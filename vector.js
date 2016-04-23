
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
