'use strict';

var test = require('tape');
var splitter = require('../lib/splitter');

test('splitter', function (t) {
  t.test('valid input', function (n) {
    var result = splitter('./blah:/hi');
    var blankEndpoint = splitter('./hah:');

    n.same(result, { endpoint: '/hi', isRoute: false, source: './blah' }, 'no separator');
    n.same(blankEndpoint, { endpoint: '/', isRoute: false, source: './hah' }, 'blank endpoint');
    n.end();
  });

  t.test('invalid input', function (n) {
    n.throws(function () {
      splitter(':/hi');
    }, Error);
    n.end();
  });
});
