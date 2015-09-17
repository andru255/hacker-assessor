var resources = require('./lib/resources');
var response = require('./lib/response');
var template = require('./lib/template');
var utils = require('./lib/utils');
var http = require('http');
var port = process.env.PORT || 8080;
var ecstatic = require('ecstatic');
var staticsFiles = ecstatic({ root: __dirname + '/public' });
var router = require('routes')();

router.addRoute('/', function(req, res) {
  resources.getHackers(function(hackers) {
    var templateData = template.prepareTemplateData(['hackers'], [hackers]);
    response.make(req, res, templateData, 'index.html.ejs');
  });
});

router.addRoute('/hackers/:hacker_id', function(req, res, params) {
  resources.getHacker(params.hacker_id, function(hacker) {
    resources.getSeniorities(function(seniorities) {
      templateData = template.prepareTemplateData(['hacker', 'seniorities'], [hacker, seniorities]);
      templateData.hacker = templateData.hacker[0];
      response.make(req, res, templateData, 'hacker.html.ejs');
    });
  });
});

router.addRoute('/hackers/:hacker_id/become/seniority/:seniority_id', function(req, res, params) {
  resources.getHacker(params.hacker_id, function(hacker) {
    resources.getSeniority(params.seniority_id, function(seniority) {
      seniority.rows[0] = utils.hackerNeededSkills(hacker.rows[0], seniority.rows[0]);
      templateData = template.prepareTemplateData(['hacker', 'seniority'], [hacker, seniority]);
      templateData.hacker = templateData.hacker[0];
      templateData.seniority = templateData.seniority[0];
      response.make(req, res, templateData, 'seniority.html.ejs');
    });
  });
});

http.createServer(function(req, res) {
  var matched = router.match(req.url);

  if (matched) {
    matched.fn(req, res, matched.params);
  } else {
    staticsFiles(req, res)
  }
}).listen(port);

console.log('Listening on http://localhost:' + port );
