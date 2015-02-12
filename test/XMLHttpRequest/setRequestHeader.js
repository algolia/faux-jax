var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest/');

test('xhr.setRequestHeader() throws when state is not OPENED', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(xhr.setRequestHeader.bind(xhr, 'content-encoding', 'UTF-8'), Error, 'State is not OPENED');
  t.end();
});

test('xhr.setRequestHeader() throws when send() flag is true', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.sendFlag = true;
  t.throws(xhr.setRequestHeader.bind(xhr), Error, 'send() flag is true');
  t.end();
});

test('xhr.setRequestHeader() throws when name is undefined', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  t.throws(xhr.setRequestHeader.bind(xhr), SyntaxError, 'Bad header name');
  t.end();
});

test('xhr.setRequestHeader() throws when value is undefined', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  t.throws(xhr.setRequestHeader.bind(xhr, 'content-encoding'), SyntaxError, 'No given value');
  t.end();
});

test('xhr.setRequestHeader() adds headers', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.setRequestHeader('name', 'val');
  t.deepEqual(xhr.requestHeaders, {
    name: 'val'
  });
  t.end();
});
