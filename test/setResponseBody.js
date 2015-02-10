var test = require('tape');

var FauxJax = require('../');
var support = require('../support');

test('setResponseBody throws when state is not OPEN', function(t) {
  var xhr = new FauxJax();
  t.throws(xhr.setResponseBody.bind(xhr, 'boom'), Error, 'State is < OPENED');
  t.end();
});

test('setResponseBody throws when send() flag is unset', function(t) {
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  t.throws(xhr.setResponseBody.bind(xhr, 'boom'), Error, 'Send() flag is unset');
  t.end();
});

test('setResponseBody throws when state is not HEADERS_RECEIVED', function(t) {
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  xhr.send();
  t.throws(xhr.setResponseBody.bind(xhr, 'boom'), Error, 'State is < HEADERS_RECEIVED');
  t.end();
});

test('setResponseBody throws when body is not a String', function(t) {
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders();
  t.throws(xhr.setResponseBody.bind(xhr, 30), Error, 'Body is not a string');
  t.end();
});

test('setResponseBody sends readystatechange event with a LOADING readyState every 10 bytes', function(t) {
  t.plan(4);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  clock.tick(500);

  var body = (new Array(20)).join();
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders();

  var receivedEvents = 0;

  var expectedEvents = [{
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  }, {
    bubbles: false,
    cancelable: false,
    currentTarget: xhr,
    eventPhase: 0,
    target: xhr,
    timestamp: 500,
    type: 'readystatechange'
  }];

  xhr.addEventListener('readystatechange', function listen(e) {
    t.deepEqual(e, expectedEvents[receivedEvents], 'event matches');
    t.equal(e.target.readyState, 3, 'readyState is LOADING');
    receivedEvents++;
    if (receivedEvents === 2) {
      xhr.removeEventListener('readystatechange', listen);
    }
  });

  xhr.setResponseBody(body);
  clock.restore();
});

test('setResponseBody sends readystatechange event with a DONE readyState when finished', function(t) {
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders();

  var receivedEvents = [];

  xhr.addEventListener('readystatechange', function listen(e) {
    receivedEvents.push(e);
  });

  xhr.setResponseBody('DAWG');

  var lastEvent = receivedEvents.pop();
  t.equal(lastEvent.target.readyState, 4, 'readyState is DONE');
  t.end();
});

test('setResponseBody sets responseText', function(t) {
  var xhr = new FauxJax();
  xhr.open('GET', '/');
  xhr.send();
  xhr.setResponseHeaders();
  xhr.setResponseBody('DAWG');

  t.equal(xhr.responseText, 'DAWG', 'responseText matches');
  t.end();
});

if (support.response) {
  test('setResponseBody sets response', function(t) {
    var xhr = new FauxJax();
    xhr.open('GET', '/');
    xhr.send();
    xhr.setResponseHeaders();
    xhr.setResponseBody('DAWG');

    t.equal(xhr.response, 'DAWG', 'response matches');
    t.end();
  });
}

if (support.response) {
  test('setResponseBody understand responseType=json', function(t) {
    var xhr = new FauxJax();
    xhr.open('GET', '/');
    xhr.responseType = 'json';
    xhr.send();
    xhr.setResponseHeaders();
    xhr.setResponseBody('{"yaw": "dawg"}');

    t.deepEqual(xhr.response, {
      yaw: 'dawg'
    }, 'response matches and is a JSON object');
    t.end();
  });
}
