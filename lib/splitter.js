'use strict';

var path = require('path');
var types = {
  '.js': 'route',
  '.json': 'json',
  '.html': 'html',
  '': 'directory',
  '*': 'asset'
};

module.exports = function (value) {
  if (!value || value.indexOf(':') === -1) {
    return value;
  }

  var split = value.split(':');
  var type = 'directory';
  var endpoint, source, ext;

  if (split.length === 2 && split[0]) {
    source = split[0];
    ext = path.extname(source);
    type = types[ext];

    if (split[1]) {
      endpoint = split[1];
    } else {
      endpoint = '/';
    }
  } else {
    throw new Error('Invalid static directory map.');
  }

  return {
    endpoint: endpoint,
    source: source,
    type: type,
  };
};
