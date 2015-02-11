var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest');

test('send throws when state is not OPENED', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(xhr.send.bind(xhr), Error, 'State is not OPENED');
  t.end();
});

test('send throws when send() flag is set', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.sendFlag = true;
  t.throws(xhr.send.bind(xhr), Error, 'send() flag is true');
  t.end();
});

test('send forces UTF-8 charset when body is not null', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.setRequestHeader('Content-Type', 'text/yaw; charset=utf-9');
  xhr.send('Hello!');

  t.equal(xhr.requestHeaders['Content-Type'], 'text/yaw;charset=UTF-8', 'Charset is UTF-8');
  t.end();
});

test('send sets default `Content-Type` when none set', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  t.equal(xhr.requestHeaders['Content-Type'], 'text-plain;charset=UTF-8', 'Default Content-Type set');
  t.end();
});

test('send sets requestBody', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  t.equal(xhr.requestBody, 'Hello!', 'requestBody set');
  t.end();
});

test('send sets requestBody to null when GET or HEAD', function(t) {
  t.plan(2);

  var methods = ['GET', 'HEAD'];
  var body = 'YAW!';

  methods.forEach(function(methodName) {
    var xhr = new XMLHttpRequest();
    xhr.open(methodName, '/HAI');
    xhr.send(body);

    t.equal(xhr.requestBody, null, 'No body set for ' + methodName);
  });
});

test('send fires a loadstart event', function(t) {
  t.plan(1);

  var sinon = require('sinon');

  var clock = sinon.useFakeTimers();
  clock.tick(500);

  var xhr = new XMLHttpRequest();

  var expectedEvent = {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    lengthComputable: false,
    loaded: 0,
    target: xhr,
    timestamp: 500,
    total: 0,
    type: 'loadstart'
  };

  xhr.onloadstart = function(e) {
    t.deepEqual(e, expectedEvent, 'Received an event through onloadstart=fn listener');
  };

  xhr.open('POST', '/yaw');
  xhr.send('Hello!');

  clock.restore();
});
