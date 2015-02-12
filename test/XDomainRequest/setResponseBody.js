var test = require('tape');

var XDomainRequest = require('../../lib/XDomainRequest/');

test('xdr.setResponseBody() throws when no body', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});
  t.throws(xdr.setResponseBody.bind(xdr), Error, 'Body is missing');
  t.end();
});

test('xdr.setResponseBody() throws when request not sent', function(t) {
  t.plan(3);
  var xdr = new XDomainRequest();
  t.throws(xdr.setResponseBody.bind(xdr), Error);
  xdr.open('GET', '/');
  t.throws(xdr.setResponseBody.bind(xdr), Error);
  xdr.send();
  xdr.setResponseHeaders({});
  t.doesNotThrow(xdr.setResponseBody.bind(xdr, ''));
});

test('xdr.setResponseBody() throws when xdr.setResponseHeaders() not called', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send('/');
  t.throws(xdr.setResponseBody.bind(xdr, ''));
});

test('xdr.setResponseBody throws when body is not a String', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});
  t.throws(xdr.setResponseBody.bind(xdr, 30), Error, 'Body is not a string');
  t.end();
});

test('xdr.setResponseBody() calls xdr.onprogress() for every 10 bytes', function(t) {
  t.plan(6);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  clock.tick(500);

  var body = (new Array(21)).join();
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  var receivedEvents = 0;

  xdr.onprogress = function() {
    t.pass('received a progress event');
    receivedEvents++;
    t.equal(xdr.responseText.length, receivedEvents * 10, 'content length updated');

    // believe it or not, you do not receive an event object
    t.equal(0, arguments.length, 'no Event object received');

    if (receivedEvents === 2) {
      xdr.onprogress = function() {};
    }
  };

  xdr.setResponseBody(body);
  clock.restore();
});

test('xdr.setResponseBody() calls xdr.onload() when finished', function(t) {
  t.plan(1);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  clock.tick(500);

  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  var expectedEvent = {
    bubbles: false,
    cancelable: false,
    currentTarget: null,
    eventPhase: 2,
    target: null,
    timestamp: 500,
    type: 'load'
  };

  xdr.onload = function listen(receivedEvent) {
    t.deepEqual(receivedEvent, expectedEvent, 'event matches');
  };

  xdr.setResponseBody('DAWG');
  clock.restore();
});

test('xdr.setResponseBody() sets xdr.responseText', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  xdr.setResponseBody('DAWG');
  t.equal(xdr.responseText, 'DAWG');
  t.end();
});

test('xdr.setResponseBody() does not change xdr.contentType by default', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({});

  xdr.setResponseBody('DAWG');
  t.equal('', xdr.contentType);
  t.end();
});

test('xdr.setResponseBody() sets xdr.contentType when in headers', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();
  xdr.setResponseHeaders({
    'Content-Type': 'application/dawg; utf-9'
  });

  xdr.setResponseBody('DAWG');
  t.equal('application/dawg', xdr.contentType);
  t.end();
});
