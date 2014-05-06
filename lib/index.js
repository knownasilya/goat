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

var staticDirs = cli.args;
var entryDir;

app.get('/', function (req, res) {
  if (cli.entryFile) {
    res.sendfile(cli.entryFile);
  }
  else if (staticDirs && !staticDirs.length) {
    fs.readFile(path.resolve(__dirname, '../', 'README.md'), 'utf8', function (err, file) {
      if (err) {
        res.send(500, 'Error parsing README.md');
      }

      res.send(marked(file));
    });
  }
});

// Add entryFile's parent directory to static dirs
if (cli.entryFile) {
  if (path.extname(cli.entryFile) !== '' && staticDirs.indexOf(cli.entryFile) === -1) {
    entryDir = path.dirname(cli.entryFile);

    staticDirs.unshift(entryDir);
  }
}

staticDirs.forEach(function (directory) {
  app.use(serveStatic(directory));
});

app.listen(cli.port, function () {
  console.log(chalk.green('Development Static Server listening on port ' + cli.port));
});

module.exports = cli;
