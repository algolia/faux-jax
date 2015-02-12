// exercice left for the reader: why is this file named "constructor_" instead
// of "constructor"?

var test = require('tape');

var XMLHttpRequest = require('../../lib/XMLHttpRequest/');
var support = require('../../lib/support');

// https://xhr.spec.whatwg.org/#interface-xmlhttprequest
test('XMLHttpRequest interface', function(t) {
  var xhr = new XMLHttpRequest();
  t.equal(xhr.onabort, null, 'onabort is null');
  t.equal(xhr.onerror, null, 'onerror is null');
  t.equal(xhr.onload, null, 'onload is null');
  t.equal(xhr.onloadend, null, 'onloadstart is null');
  t.equal(xhr.onloadstart, null, 'onloadstart is null');
  t.equal(xhr.onprogress, null, 'onprogress is null');
  t.equal(xhr.onreadystatechange, null, 'onreadystatechange is null');
  t.equal(xhr.ontimeout, null, 'ontimeout is null');
  t.equal(xhr.readyState, 0, 'readyState is 0');
  t.equal(xhr.response, '', 'response is empty string');
  t.equal(xhr.responseText, '', 'responseText is empty string');
  t.equal(xhr.responseType, '', 'responseType is empty string');
  t.equal(xhr.responseURL, '', 'responseURL is empty string');
  t.equal(xhr.responseXML, null, 'responseXML is null');
  t.equal(xhr.status, 0, 'response status is 0');
  t.equal(xhr.statusText, '', 'response statusText is empty string');

  if (support.timeout) {
    t.equal(xhr.timeout, 0, 'default timeout is 0');
  }

  if (support.withCredentials) {
    t.equal(xhr.withCredentials, false, 'withCredentials defaults to false');
  }

  t.end();
});
