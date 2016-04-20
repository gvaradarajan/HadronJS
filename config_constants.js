var configConstants = {
  FRICTION_COEFF: 0,
  ELASTIC: true,
  CONST_DENSITY: null,
  CONST_MASS: null,
  CONST_RADIUS: null
};


configConstants.setConstants = function (options) {
  Object.keys(this).forEach(function (key) {
    this[key] = options[key];
  });
};

module.exports = configConstants;
