var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest/');

function parseHeaders(headers) {
  var parsedHeaders = {};
  var pairs = headers.trim().split('\n');
  var i;
  var split;
  var key;
  var value;

  for (i = 0; i < pairs.length; i++) {
    split = pairs[i].split(':');
    key = split.shift().trim();
    value = split.join(':').trim();
    parsedHeaders[key] = value;
  }

  return parsedHeaders;
}

test('xhr.getAllResponseHeaders() sends empty string when no headers', function(t) {
  var xhr = new XMLHttpRequest();
  t.equal('', xhr.getAllResponseHeaders(), 'we get an empty string');
  t.end();
});

test('xhr.getAllResponseHeaders() sends all response headers when present', function(t) {
  var headers = {'how': 'dy'};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();
  xhr.respond(200, headers);
  t.deepEqual(parseHeaders(xhr.getAllResponseHeaders()), headers, 'we get all the headers');
  t.end();
});
