var fs = require('fs');
var handlebars = require('handlebars');

var render = function(data, outputFile) {

  var components = JSON.parse(fs.readFileSync(data, 'utf8'));
  var template = __dirname+'/page.tmpl.html';

  fs.readFile(template, 'utf-8', function(err, source) {

    if (err) {

      console.log(err);

    } else {

      handlebars.registerHelper('sluggify', function(name) {
        return name
          .toLowerCase()
          .replace(/ /g,'-')
          .replace(/[^\w-]+/g,'');
      });

      handlebars.registerHelper('trim', function(text) {
        return text.trim();
      });

      handlebars.registerHelper('oneline', function(text) {
        return text.replace(/(\r\n|\n|\r)/gm, '')
                   .replace(/>\s{1,}</g, '><');
      });

      handlebars.registerPartial('pocket', fs.readFileSync(__dirname+'/partials/pocket.tmpl.html', 'utf8'));

      console.log(__dirname+'/partials/pocket.tmpl.html');

      var template = handlebars.compile(source);
      var html = template(components);
      fs.writeFileSync(outputFile, html, 'utf8');

      console.log('\033[0;32m\u2713 rendered\033[0m');

    }

  });

};

module.exports = render;
