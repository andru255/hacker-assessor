var ejs = require('ejs');
var fs = require('fs');

exports.make = function(req, res, params) {
  template('hacker.html.ejs', function(err, file) {
    res.statusCode = 200;
    res.statusMessage = 'Success';
    res.setHeader("Content-Type", "text/html");
    res.end(ejs.compile(file)(params));
  });
}

/**
 * Make a template file available to work with.
 * @param {string} fileName Is a filename of a template inside the templates folder.
 * @param {templateCallback} callback A callback to work with the template file.
 *
 * @callback templateCallback
 * @summary Put inside here all the code that uses the template file.
 * @param {object} error
 * @param {string} file
 */
function template (fileName, callback) {
  fs.readFile(__dirname + '/templates/' + fileName, { encoding: 'utf8' }, callback);
}
