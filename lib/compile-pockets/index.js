var fs = require('fs');
var fr = require('yaml-front-matter');
var _ = require('lodash');

var compile = function(directory, outputFile) {

  // Get array of files and remove any that are not .yml files
  var files = fs.readdirSync(directory);
  files = _.remove(files, function(n) {
    return n.indexOf('.yml') !== -1;
  });

  // Initialize output array
  var pocketArray = [];

  // Get the data from the yaml and add each file's data
  // to the pocketArray array, ordering the tags alphabetically
  files.forEach(function(file) {
    var data = fs.readFileSync(directory +'/'+ file, 'utf8');
    var object = fr.loadFront(data);
    object.tags.sort();
    pocketArray.push(object);
  });

  // Initialized the object to be save as json
  // then randomize the order
  var json = {};
  json.pockets = _.shuffle(pocketArray);

  // Make an array of all the tags used across all the pockets
  var allTags = _.unique(_.flatten(_.pluck(json.pockets, 'tags')));
  json.allTags = allTags;

  // Extract pockets config object from package.json and apply
  var packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  var pocketsConfig = packageJSON.pockets;
  json.pocketsConfig = pocketsConfig;

  // Prettify the output
  var output = JSON.stringify(json, null, '\t');

  // Write the prettified JSON string
  fs.writeFileSync(outputFile, output, 'utf8');

  // Green text = success!
  console.log('\033[0;32m\u2713 compiled\033[0m');

};

module.exports = compile;
