var fs = require('fs');
var path = require('path');
var cli = require('ltcdr');
var chalk = require('chalk');
var express = require('express');
var marked = require('marked');
var splitter = require('./splitter');
var pkg = require('../package');
var app = express();

marked.setOptions({
  // Github Flavored Markdown
  gfm: true
});

cli.version(pkg.version)
  .option('-e, --entry-file [file]', 'Usually an index.html', './index.html')
  .option('-p, --port [port]', 'Port to run server on', 3000)
  .option('-d, --domain-host [host]', 'Host to serve static files at', 'localhost')
  .option('-x, --debug', 'Enable development logging for debugging purposes')
  .option('-c, --cors', 'Enable cors')
  .parse(process.argv);

var staticDirs = cli.args;
var entryDir;

if (cli.debug) {
  app.use(require('morgan')('dev'));
}

if (cli.cors) {
  app.use(function (req, res, next) {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'});
    next();
  });
}

// Add entryFile's parent directory to static dirs
if (cli.entryFile) {
  if (path.extname(cli.entryFile) !== '' && staticDirs.indexOf(cli.entryFile) === -1) {
    entryDir = path.dirname(cli.entryFile);

    staticDirs.unshift(entryDir);
  }
}

staticDirs.forEach(function (directory) {
  var data = splitter(directory);

  if (typeof data === 'object' && data.endpoint) {
    if (data.type === 'json') {
      app.get(data.endpoint, function (req, res) {
        res.json(require(path.resolve(data.source)));
      });
    } else if (data.type === 'route') {
      var route = require(path.resolve(data.source));

      if (typeof route === 'function') {
        app.use(route(app, data.endpoint, express));
      }
    } else if (data.type === 'html') {
      if (data.source.indexOf('/index.html') !== -1) {
        var source = data.source.replace('/index.html', '');
        app.use(data.endpoint, express.static(source));
      } else {
        app.get(data.endpoint, function (req, res) {
          res.sendFile(data.source);
        });
      }
    } else {
      app.use(data.endpoint, express.static(data.source, { index: false }));
    }
  } else if (typeof data === 'string') {
    app.use(express.static(data, { index: false }));
  } else {
    throw 'Invalid static directory specified.';
  }
});

app.get('/*', function (req, res) {
  if (cli.entryFile) {
    res.sendFile(cli.entryFile, { root: process.cwd() });
  } else if (staticDirs && !staticDirs.length) {
    fs.readFile(path.resolve(__dirname, '../', 'README.md'), 'utf8', function (err, file) {
      if (err) {
        res.send(500, 'Error parsing README.md');
      }

      res.send(marked(file));
    });
  }
});

cli.port = process.env.PORT || cli.port;

app.listen(cli.port, cli.domainHost, function () {
  console.log(chalk.green('Goat server listening on port %s'), cli.port);
});

module.exports = cli;
