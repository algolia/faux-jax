// we wait for dom ready because __zuul makes ajax requests itself
// otherwise we intercept them too
// we use domready@0.3.0 specifically to be compatible
// with ie6/7/8
var domready = require('domready');
var test = require('tape');

var fauxJax = require('../');

domready(run);

function run() {
  var support = require('../lib/support');

  var bulkRequire = require('bulk-require');

  if (support.hasXDomainRequest) {
    bulkRequire(__dirname, ['./XDomainRequest/*.js']);
  }

  if (support.hasXMLHttpRequest) {
    bulkRequire(__dirname, ['./XMLHttpRequest/*.js']);
  }

  if (support.hasXMLHttpRequest) {
    test('nothing gets intercepted by default', function(t) {
      t.plan(2);
      var xhr = new XMLHttpRequest();
      xhr.open('GET', location.pathname);
      if (support.addEventListener) {
        xhr.addEventListener('load', function() {
          t.pass('We used addEventListener');
          t.ok(
            /faux\-jax/.test(xhr.responseText),
            'We got the current location content with ajax'
          );
        });
      } else {
        xhr.onreadystatechange = function() {
          if (xhr.readyState !== 4) {
            return;
          }

          t.pass('We used onreadystatechange=');
          t.ok(
            /faux\-jax/.test(xhr.responseText),
            'We got the current location content with ajax'
          );
        };
      }
      xhr.send();
    });

    test('fauxJax intercepts XMLHttpRequests', function(t) {
      fauxJax.install();
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/fo1pf1');
      xhr.send();
      xhr.respond(200, {}, 'WO!');
      t.equal(1, fauxJax.requests.length, 'We intercepted one xhr');
      t.equal('WO!', xhr.responseText, 'xhr.respond() call worked, body matches');
      fauxJax.restore();
      t.equal(0, fauxJax.requests.length, 'fauxJax.restore() resets fauxJax.requests to []');
      t.end();
    });
  }

  if (support.hasXDomainRequest) {
    test('fauxJax intercepts XDomainRequests', function(t) {
      fauxJax.install();
      var xdr = new XDomainRequest();
      xdr.open('GET', '/fo1pf1');
      xdr.send();
      xdr.respond(200, {}, 'WO!');
      t.equal(1, fauxJax.requests.length, 'We intercepted one xdr');
      t.equal('WO!', xdr.responseText, 'xdr.respond() call worked');
      fauxJax.restore();
      t.equal(0, fauxJax.requests.length, 'fauxJax.restore() resets fauxJax.requests to []');
      t.end();
    });
  }
}
