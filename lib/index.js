var cli = require('ltcdr');
var pkg = require('../package');
var express = require('express');
var serveStatic = require('serve-static');
var app = express();

cli.version(pkg.version)
  .option('-e, --entry-file [file]', 'Usually an index.html', './index.html')
  .option('-p, --port [port]', 'Port to run server on', 3000)
  .parse(process.argv);

app.get('/', function (req, res) {
  res.sendfile(cli.entryFile);
});

cli.args.forEach(function (directory) {
  app.use(serveStatic(directory));
});

app.listen(cli.port, function () {
  console.log('Development Static Server listening on port ' + cli.port);
});

module.exports = cli;
