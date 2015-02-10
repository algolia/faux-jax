var inherits = require('util').inherits;

var XMLHttpRequest = require('./lib/XMLHttpRequest');
var native = require('./lib/native');
var support = require('./lib/support');

var fauxJax = module.exports = {};

fauxJax.install = function() {
  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = FakeXHR;
  }
};

fauxJax.restore = function() {
  if (support.hasXMLHttpRequest) {
    global.XMLHttpRequest = native.XMLHttpRequest;
  }

  fauxJax.requests = [];
};

fauxJax.requests = [];

function FakeXHR() {
  XMLHttpRequest.call(this);
  fauxJax.requests.push(this);
}

inherits(FakeXHR, XMLHttpRequest);
