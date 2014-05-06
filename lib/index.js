var fs = require('fs');
var path = require('path');
var cli = require('ltcdr');
var chalk = require('chalk');
var express = require('express');
var marked = require('marked');
var serveStatic = require('serve-static');
var pkg = require('../package');
var app = express();

marked.setOptions({
  // Github Flavored Markdown
  gfm: true
});

cli.version(pkg.version)
  .option('-e, --entry-file [file]', 'Usually an index.html')
  .option('-p, --port [port]', 'Port to run server on', 3000)
  .parse(process.argv);

app.get('/', function (req, res) {
  if (cli.entryFile) {
    if (path.extname(cli.entryFile) !== '' && cli.args.indexOf(cli.entryPath) === -1) {
      cli.args.push(path.dirname(cli.entryFile));
    }

    res.sendfile(cli.entryFile);
  }
  else if (cli.args && !cli.args.length) {
    fs.readFile(path.resolve(__dirname, '../', 'README.md'), 'utf8', function (err, file) {
      if (err) {
        res.send(500, 'Error parsing README.md');
      }

      res.send(marked(file));
    });
  }
});

cli.args.forEach(function (directory) {
  app.use(serveStatic(directory));
});

app.listen(cli.port, function () {
  console.log(chalk.green('Development Static Server listening on port ' + cli.port));
});

module.exports = cli;
