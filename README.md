#HadronJS

HadronJS is a 2D JavaScript physics engine for objects rendered on HTML5 Canvas. It can be used for games, simulations, and other applications. It currently supports implementation of surface friction and elastic collisions of hard spheres. A list of features to be included can be found at the bottom of this document.

###Installation Instructions

The `bundle.js` and webpack configuration file are present for the sake of the demo. However, to install the library, one should probably delete these files, create a new webpack configuration file and then run `webpack --watch`. In the demo, the entry point is `engine.js`, but this should be replaced by a different file depending on personal use.

###Using The Library

The key to using the library is in the file `engine.js`. Within the file, there is an engine function, shown below.

```
var engine = function (options, callback) {
  var Constants = require('./config_constants.js');
  var Vector = require('./vector.js');
  var movingSphere;

  if (Constants.ELASTIC === true) {
    movingSphere = require('./elastic/movingSphere.js');
  }

  callback(Constants, Vector, movingSphere);

};

```

You may notice that there are two arguments to the engine function. One is options, which is a settings object you can provide to overwrite the default settings in `config_constants.js`. An example (from the demo) is shown below:

```
var newOptions = {
  FRICTION_COEFF: 0,
  ELASTIC: true,
  WALLS: true,
  CONST_DENSITY: 0.00025,
  DIM_X: 750,
  DIM_Y: 750
};
```
The other argument is a callback. This callback should probably be the main rendering function in your application, as illustrated in the demo code (in `engine.js`).

###Technical Details: Handling Collisions

To handle all collisions with a single function, when a collision is detected, the velocities of the moving spheres are rotated to the frame of reference of the center of mass of the collision (in other words, a coordinate system where the line passing through the centers of both spheres is the x-axis).

```
var connVec = new Vector(this.pos[0] - otherObj.pos[0],
                         this.pos[1] - otherObj.pos[1]);
var resultRotation = connVec.findTheta();

var thisVel = this.vel.rotate(resultRotation);
var otherVel = otherObj.vel.rotate(resultRotation);
```

After applying the equations for the final velocities of two spheres in a 2D elastic collision (with the collision angle being Pi, due to the rotation), the results are then rotated back to the coordinate frame of the canvas.

```
// the two lines below are necessary due to the inversion of the y-axis in HTML5 Canvas
otherObj.vel[1] = -otherObj.vel[1];
this.vel[1] = -this.vel[1];

this.vel = this.vel.rotate(-resultRotation);
otherObj.vel = otherObj.vel.rotate(-resultRotation);
```
This code handles all possible cases of elastic collisions.

###Demo

[A simulation demo](http://www.gauthamvaradarajan.com/HadronJS)
[Browser Game built on HadronJS](http://www.gauthamvaradarajan.com/Pool)

###Upcoming features:
* [ ] Support for inelastic collisions
* [ ] Support for electromagnetic and gravitational interaction
* [ ] Support for objects of other shapes
