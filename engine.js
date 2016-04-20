(function (root, options) {
  var Constants = require('./config_constants.js');
  var movingSphere;

  Constants.setConstants(options);

  if (Constants.ELASTIC === true) {
    movingSphere = require('./elastic/movingSphere.js');
  }
}).bind(null, window);
