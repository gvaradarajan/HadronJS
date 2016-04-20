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
    this[key] = options[key];
  });
};

module.exports = configConstants;
