var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest/');
var support = require('../../lib/support');

if (support.timeout) {
  test('timeout is initialized at 0', function(t) {
    var xhr = new XMLHttpRequest();
    t.equal(xhr.timeout, 0, 'timeout initialized at 0');
    t.end();
  });

  test('when timeout has passed, we get a timeout event', function(t) {
    t.plan(1);

    var sinon = require('sinon');
    var clock = sinon.useFakeTimers();
    var xhr = new XMLHttpRequest();
    xhr.timeout = 500;
    xhr.open('GET', '/');
    xhr.send();

    xhr.ontimeout = function() {
      t.pass('We received a timeout event');
      clock.restore();
    };

    clock.tick(800);
  });
}
