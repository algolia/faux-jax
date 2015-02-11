var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest');

test('setResponseHeaders throws when state is not open', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(xhr.setResponseHeaders.bind(xhr), Error, 'State is not OPENED');
  t.end();
});

test('setResponseHeaders throws when send() flag is unset', function(t) {
  var xhr = new XMLHttpRequest();
  t.throws(xhr.setResponseHeaders.bind(xhr), Error, 'State is not OPENED');
  xhr.open('GET', '/');
  t.throws(xhr.setResponseHeaders.bind(xhr), Error, 'Send() flag is unset');
  t.end();
});

test('setResponseHeaders sets response headers', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  xhr.setResponseHeaders({
    'cache-control': 'no way'
  });

  t.deepEqual(xhr.responseHeaders, {
    'cache-control': 'no way'
  }, 'Response headers matches');

  t.end();
});

test('setResponseHeaders sets readyState to HEADERS_RECEIVED (2)', function(t) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  xhr.setResponseHeaders();

  t.equal(xhr.readyState, 2, 'readyState is HEADERS_RECEIVED');
  t.end();
});

test('setResponseHeaders fires a readystatechange event', function(t) {
  t.plan(1);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  clock.tick(500);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/');
  xhr.send();

  var expectedEvent = {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  };

  xhr.onreadystatechange = function(e) {
    t.deepEqual(e, expectedEvent, 'event matches');
  };

  xhr.setResponseHeaders();

  t.end();
});
