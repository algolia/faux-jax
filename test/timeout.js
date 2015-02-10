var test = require('tape');

var FauxJax = require('../');
var support = require('../support');

if (support.timeout) {
  test('timeout is initialized at 0', function(t) {
    var xhr = new FauxJax();
    t.equal(xhr.timeout, 0, 'timeout initialized at 0');
    t.end();
  });

  test('when timeout has passed, we get a timeout event', function(t) {
    t.plan(1);

    var sinon = require('sinon');
    var clock = sinon.useFakeTimers();
    var xhr = new FauxJax();
    xhr.timeout = 500;
    xhr.open('GET', '/');
    xhr.send();

    xhr.addEventListener('timeout', function() {
      t.pass('We received a timeout event');
      clock.restore();
    });

    clock.tick(800);
  });
}
