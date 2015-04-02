var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

var forEach = require('lodash').forEach;
var Mitm = require('mitm');

function FauxJax() {
  this._installed = false;
}

inherits(FauxJax, EventEmitter);

FauxJax.prototype.install = function() {
  if (this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `install()` twice. Did you forgot to call `restore()`?'));
    return;
  }

  this._installed = true;

  this._mitm = Mitm();
  this._mitm.on('request', this._newRequest.bind(this));
  this._mitm.on('connect', this._newSocket.bind(this));
};

FauxJax.prototype.restore = function() {
  if (!this._installed) {
    this.emit('error', new Error('faux-jax: Cannot call `restore()` when not installed'));
    return;
  }

  this._installed = false;
  this._mitm.disable();
  this.removeAllListeners('request');
};

FauxJax.prototype.waitFor = function(n, callback) {
  var fj = this;
  var fakeRequests = [];

  this.on('request', waitFor);

  function waitFor(fakeRequest) {
    fakeRequests.push(fakeRequest);
    if (fakeRequests.length === n) {
      fj.removeListener('request', waitFor);
      callback(null, fakeRequests);
    }
  }
};

// specific Node.JS implementation, can be used to
// socket.emit('error') which will then be
FauxJax.prototype._newSocket = function(socket) {
  this.emit('socket', socket);
};

FauxJax.prototype._newRequest = function(req, res) {
  if (this.listeners('request').length === 0) {
    this.emit('error', new Error('faux-jax: received an unexpected request: ' + req.url));
    return;
  }

  var fj = this;
  var chunks = [];

  var fakeRequest = new FakeRequest({
    requestMethod: req.method,
    // cannot detect http from https for now,
    // https://github.com/moll/node-mitm/issues/10
    // so we default to http
    requestURL: 'http://' + req.headers.host + req.url,
    requestHeaders: req.headers,
    requestBody: null,
    res: res
  });

  req.on('end', function() {
    if (chunks.length > 0) {
      fakeRequest.requestBody = Buffer.concat(chunks).toString();
    }

    fj.emit('request', fakeRequest);
  });

  req.on('data', function(chunk) {
    chunks.push(chunk);
  });
};

function FakeRequest(opts) {
  this._res = opts.res;
  this.requestMethod = opts.requestMethod;
  this.requestURL = opts.requestURL;
  this.requestHeaders = opts.requestHeaders;
  this.requestBody = opts.requestBody;
}

FakeRequest.prototype.setResponseHeaders = function(headers) {
  var fj = this;
  forEach(headers, function(headerValue, headerName) {
    fj._res.setHeader(headerName, headerValue);
  });
};

FakeRequest.prototype.setResponseBody = function(body) {
  this._res.write(body);
};

FakeRequest.prototype.respond = function(statusCode, headers, body) {
  if (headers) {
    this.setResponseHeaders(headers);
  }

  this._res.statusCode = statusCode;

  if (body !== undefined) {
    this.setResponseBody(body);
  }

  this._res.socket.emit('end');
};

module.exports = new FauxJax();
