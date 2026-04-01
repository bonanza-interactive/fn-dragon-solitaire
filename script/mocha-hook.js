// At the time of writing, Howler does not run under Node without this
// workaround (see: https://github.com/goldfire/howler.js/issues/637)
let {HowlerGlobal} = require('howler');
global.HowlerGlobal = HowlerGlobal;

// Stub WebGL symbols
require('webgl-mock');
