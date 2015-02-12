var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest/');

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
  t.deepEqual(xhr.getAllResponseHeaders(), headers, 'we get all the headers');
  t.end();
});
