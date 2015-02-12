var test = require('tape');
var XDomainRequest = require('../../lib/XDomainRequest/');

test('xdr.open() throws when missing parameters', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  t.throws(xdr.open.bind(xdr), Error);
});

test('xdr.open() throws when missing url', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest('GET');
  t.throws(xdr.open.bind(xdr, 'GET'), Error);
});

test('xdr.open() throws when bad method name', function(t) {
  t.plan(1);
  var xdr = new XDomainRequest();
  t.throws(xdr.open.bind(xdr, 'dsad', '/'), Error);
});

['get', 'post', 'GET', 'POST', 'GeT', 'PoST']
  .forEach(function testMethod(methodName) {
    test('xdr.open() accepts ' + methodName + ' method', function(t) {
      t.plan(3);
      var xdr = new XDomainRequest();
      t.doesNotThrow(xdr.open.bind(xdr, methodName, '/'));
      t.equal(
        xdr.requestMethod,
        methodName.toUpperCase(),
        'xdr.requestMethod was set to `' + xdr.requestMethod + '` (was ' + methodName + ')');
      t.equal(xdr.requestURL, '/', 'xdr.requestURL was set to `/`');
    });
  });
