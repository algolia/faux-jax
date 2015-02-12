var inherits = require('util').inherits;

var XMLHttpRequest = require('./lib/XMLHttpRequest/');
var XDomainRequest = require('./lib/XDomainRequest/');
var native = require('./lib/native');
var support = require('./lib/support');

var fauxJax = module.exports = {};

fauxJax.install = function() {
  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = FakeXHR;
  }

  if (support.hasXDomainRequest) {
    global.XDomainRequest = FakeXDR;
  }
};

fauxJax.restore = function() {
  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = native.XMLHttpRequest;
  }

  if (support.hasXDomainRequest) {
    global.XDomainRequest = native.XDomainRequest;
  }

  fauxJax.requests = [];
};

fauxJax.requests = [];

function FakeXHR() {
  XMLHttpRequest.call(this);
  fauxJax.requests.push(this);
}

inherits(FakeXHR, XMLHttpRequest);

function FakeXDR() {
  XDomainRequest.call(this);
  fauxJax.requests.push(this);
}

inherits(FakeXDR, XDomainRequest);
