var Render = require('../render-pockets');

// Take the returned data from the compile function
// And render the JSON as HTML
var rendered = Render('./pockets.json', './index.html');
