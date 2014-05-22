'use strict';

module.exports = function (value) {
  if (!value || value.indexOf(':') === -1) {
    return value;
  }

  var split = value.split(':');
  var endpoint, source;

  if (split.length === 2 && split[0]) {
    source = split[0];

    if (split[1]) {
      endpoint = split[1];
    }
    else {
      endpoint = '/';
    }
  }
  else {
    throw new Error('Invalid static directory map.');
  }

  return {
    endpoint: endpoint,
    source: source
  };
};
