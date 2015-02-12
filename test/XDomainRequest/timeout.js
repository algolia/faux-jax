var test = require('tape');

var XDomainRequest = require('../../lib/XDomainRequest/');

test('timeout is initialized at -1', function(t) {
  var xdr = new XDomainRequest();
  t.equal(xdr.timeout, -1, 'timeout initialized at -1');
  t.end();
});

test('when timeout has passed, we get a timeout event', function(t) {
  t.plan(1);

  var sinon = require('sinon');
  var clock = sinon.useFakeTimers();
  var xdr = new XDomainRequest();
  xdr.timeout = 500;
  xdr.open('GET', '/');
  xdr.send();

  var expectedEvent = {
    bubbles: false,
    cancelable: false,
    currentTarget: null,
    eventPhase: 2,
    target: null,
    timestamp: 500,
    type: 'timeout'
  };

  xdr.ontimeout = function(receivedEvent) {
    t.deepEqual(receivedEvent, expectedEvent, 'We received a timeout event');
    clock.restore();
  };

  clock.tick(800);
});
