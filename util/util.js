var Constants = require("../config_constants.js");
var Vector = require("../vector.js");

module.exports = {

  randomPos: function () {
    return [(Constants.DIM_X - 42) * Math.random() + 21,
            (Constants.DIM_Y - 42) * Math.random() + 21];
  },
  randomColor: function () {
    return "#FF" + Math.round((Math.random() * 9999));
  },
  randomParams: function () {
    var creationParams = {};
    var density = Constants.CONST_DENSITY;
    var radius = (Math.random() * 15) + 10;
    creationParams.color = this.randomColor();
    creationParams.pos = this.randomPos();
    creationParams.vel = new Vector(Math.random() * 7, Math.random() * 7);
    creationParams.radius = radius;
    creationParams.mass = Math.pow(radius, 3) * (4/3) * Math.PI * density;
    return creationParams;
  }
};
