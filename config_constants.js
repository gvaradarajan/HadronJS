var configConstants = {
  FRICTION_COEFF: 0,
  ELASTIC: true,
  CONST_DENSITY: null,
  CONST_MASS: null,
  CONST_RADIUS: null,
  SPACE_DIM: 2
};


configConstants.setConstants = function (options) {
  Object.keys(this).forEach(function (key) {
    this[key] = options[key];
  });
};

module.exports = configConstants;
