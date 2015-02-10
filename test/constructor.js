var test = require('tape');

var FauxJax = require('../');
var support = require('../support');

test('new FauxJax()', function(t) {
  t.ok(new FauxJax(), 'Constructor works');
  t.end();
});

test('constructor inits some properties', function(t) {
  var fauxJax = new FauxJax();
  t.equal(fauxJax.onabort, null, 'onabort is null');
  t.equal(fauxJax.onerror, null, 'onerror is null');
  t.equal(fauxJax.onload, null, 'onload is null');
  t.equal(fauxJax.onloadend, null, 'onloadstart is null');
  t.equal(fauxJax.onloadstart, null, 'onloadstart is null');
  t.equal(fauxJax.onprogress, null, 'onprogress is null');
  t.equal(fauxJax.onreadystatechange, null, 'onreadystatechange is null');
  t.equal(fauxJax.ontimeout, null, 'ontimeout is null');
  t.equal(fauxJax.readyState, 0, 'readyState is 0');
  t.equal(fauxJax.response, '', 'response is empty string');
  t.equal(fauxJax.responseText, '', 'responseText is empty string');
  t.equal(fauxJax.responseType, '', 'responseType is empty string');
  t.equal(fauxJax.responseURL, '', 'responseURL is empty string');
  t.equal(fauxJax.responseXML, null, 'responseXML is null');
  t.equal(fauxJax.status, 0, 'response status is 0');
  t.equal(fauxJax.statusText, '', 'response statusText is empty string');

  if (support.timeout) {
    t.equal(fauxJax.timeout, 0, 'default timeout is 0');
  }

  if (support.withCredentials) {
    t.equal(fauxJax.withCredentials, false, 'withCredentials defaults to false');
  }

  t.end();
});
