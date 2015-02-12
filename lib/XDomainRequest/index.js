// xdr.open('dsa') => Invalid argument
// xdr.open('GET') => Argument not optional

module.exports = XDomainRequest;

var inherits = require('util').inherits;

var Event = require('../Event');
var EventTarget = require('../EventTarget')({
  // force removal of addEventListener methods,
  // even if IE9 has them on XMLHttpRequest, it lacks them
  // on XDomainRequest (yes)
  addEventListener: false
});

var events = require('./events');
var methods = require('./methods.js');

function XDomainRequest() {
  EventTarget.call(this, events);

  this.contentType = '';
  this.responseText = '';
  this.timeout = -1;

  // fauxJax specific API
  this.requestBody = null;
  this.requestMethod = null;
  this.requestURL = null;
}

inherits(XDomainRequest, EventTarget);

XDomainRequest.prototype.open = function(method, url) {
  if (!method || !url) {
    // this is the exact error sent by IE
    throw new Error('Argument not optional.');
  }

  var normalizedMethod = method.toUpperCase();

  if (methods.indexOf(normalizedMethod) === -1) {
    // this is the exact error sent by IE
    throw new Error('Invalid argument.');
  }

  this.requestMethod = normalizedMethod;
  this.requestURL = url;
};

XDomainRequest.prototype.send = function(body) {
  if (this.requestMethod === 'GET' && body !== undefined) {
    return dispatchEvent(this, 'error', {
      bubbles: false,
      cancelable: false
    });
  }

  if (this.requestMethod === 'POST' && body !== undefined && typeof body !== 'string') {
    throw new Error('Invalid argument.');
  }

  if (body !== undefined) {
    this.requestBody = body;
  }

  this.sendFlag = true;

  this._setTimeoutIfNecessary();
};

XDomainRequest.prototype.abort = function() {
  this.contentType = '';
  this.responseText = '';
};

// now onto fauxJax's specific API
XDomainRequest.prototype.setResponseHeaders = function(headers) {
  if (!headers) {
    throw new Error('Please specify at least one header when using xdr.setResponseHeaders()');
  }

  if (this.sendFlag !== true) {
    throw new Error('Call xdr.open() and xdr.send() before using xdr.setResponseHeaders()')
  }

  this.responseHeaders = {};

  var xdr = this;
  Object.keys(headers).forEach(function assignToResponseHeaders(headerName) {
    xdr.responseHeaders[headerName] = headers[headerName];
  });
};

XDomainRequest.prototype.setResponseBody = function(body) {
  if (typeof body !== 'string') {
    throw new Error('xhr.setResponseBody() expects a String');
  }

  if (this.sendFlag !== true) {
    throw new Error('Call xdr.open() and xdr.send() before using xdr.setResponseBody()')
  }

  if (!this.responseHeaders) {
    throw new Error('Call xdr.setResponseHeaders() before calling xdr.setResponseBody()');
  }

  if (this.responseHeaders['Content-Type']) {
    this.contentType = this.responseHeaders['Content-Type'].split(';')[0];
  }

  var chunkSize = 10;
  var index = 0;

  while (index < body.length) {
    this.responseText += body.slice(index, index + chunkSize);
    index += chunkSize;
    dispatchEvent(this, 'progress', -1);
  }

  if (this._timeoutID) {
    clearTimeout(this._timeoutID);
  }

  dispatchEvent(this, 'load', {
    bubbles: false,
    cancelable: false
  });
};

XDomainRequest.prototype.respond = function(statusCode, headers, body) {
  if (headers) {
    this.setResponseHeaders(headers);
  }

  if (body !== undefined) {
    this.setResponseBody(body);
  }
};

XDomainRequest.prototype._setTimeoutIfNecessary = function() {
  if (this.timeout > 0 && this._timeoutID === undefined) {
    this._timeoutID = setTimeout(
      dispatchEvent.bind(
        null,
        this,
        'timeout', {
          bubbles: false,
          cancelable: false
        }),
        this.timeout
      );
  }
};

function dispatchEvent(eventTarget, type, params) {
  var event;

  // XDomainRequest specific progress event where there's no
  // event object sent
  if (params === -1) {
    event = type;
  } else {
    params = params || {};

    event = new Event(type, {
      bubbles: params.bubbles,
      cancelable: params.cancelable
    });

    // target and currentTarget are always `null` on IE8/9 on XDomainRequest
    // if you find a case where it's not, show me
    event.target = null;
    event.currentTarget = null;

    Object
      .keys(params)
      .forEach(function assignToConstructorAndPrototype(paramName) {
        event[paramName] = params[paramName];
      });

    event.eventPhase = Event.AT_TARGET;
  }

  eventTarget.dispatchEvent(event);
}
