var test = require('tape');

var XDomainRequest = require('../../lib/XDomainRequest/');

test('xdr.setResponseHeaders() throws when request not sent', function(t) {
  var xdr = new XDomainRequest();
  t.throws(xdr.setResponseHeaders.bind(xdr), Error);
  xdr.open('GET', '/');
  t.throws(xdr.setResponseHeaders.bind(xdr), Error);
  xdr.send();
  t.doesNotThrow(xdr.setResponseHeaders.bind(xdr, {}));
  t.end();
});

test('xdr.setResponseHeaders() throws when no headers given', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send('/');
  t.throws(xdr.setResponseHeaders.bind(xdr), Error, 'no headers given');
  t.end();
});

test('xdr.setResponseHeaders() sets response headers', function(t) {
  var xdr = new XDomainRequest();
  xdr.open('GET', '/');
  xdr.send();

  xdr.setResponseHeaders({
    'cache-control': 'no way'
  });

  t.deepEqual(
    xdr.responseHeaders, {
      'cache-control': 'no way'
    },
    'Response headers matches'
  );

  t.end();
});
