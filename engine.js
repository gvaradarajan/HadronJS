(function (root) {
  var Constants = require('./config_constants.js');
  var movingSphere;

  if (Constants.ELASTIC === true) {
    movingSphere = require('./elastic/movingSphere.js');
  }
}) (window);
