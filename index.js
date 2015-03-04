var inherits = require('util').inherits;

var XMLHttpRequestMock = require('./lib/XMLHttpRequest/');
var XDomainRequestMock = require('./lib/XDomainRequest/');
var native = require('./lib/native');
var support = require('./lib/support');

var fauxJax = module.exports = {};

var installed;

fauxJax.install = function() {
  if (installed) {
    throw new Error('Cannot call `fauxJax.install()` twice. Did you forgot to call `fauxJax.restore()`?');
  }

  installed = true;

  // only modify the writable state of XMLHttpRequest in old ies when installing
  // it will be done only once
  require('./lib/make-native-implementations-writable.js')();

  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = FakeXHR;
  }

  if (support.hasXDomainRequest) {
    global.XDomainRequest = FakeXDR;
  }
};

fauxJax.restore = function() {
  installed = false;

  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = native.XMLHttpRequest;
  }

  if (support.hasXDomainRequest) {
    global.XDomainRequest = native.XDomainRequest;
  }

  fauxJax.requests = [];
};

fauxJax.requests = [];

fauxJax.support = support;

function FakeXHR() {
  XMLHttpRequestMock.call(this);
  fauxJax.requests.push(this);
}

inherits(FakeXHR, XMLHttpRequestMock);

function FakeXDR() {
  XDomainRequestMock.call(this);
  fauxJax.requests.push(this);
}

inherits(FakeXDR, XDomainRequestMock);
