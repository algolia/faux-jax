module.exports = XMLHttpRequest;

var inherits = require('util').inherits;

var Event = require('../Event');
var EventTarget = require('../EventTarget')();

var events = require('./events');
var forbiddenHeaderNames = require('./forbidden-header-names');
var forbiddenMethods = require('./forbidden-methods');
var httpStatusCodes = require('./http-status-codes');
var methods = require('./methods.js');
var states = require('./states');
var support = require('../support');

// https://xhr.spec.whatwg.org/#constructors
function XMLHttpRequest() {
  EventTarget.call(this, events);

  this.readyState;

  if (support.timeout) {
    this.timeout = 0;
  }

  if (support.cors) {
    this.withCredentials = false;
  }

  this.upload;
  this.responseType = '';
  this.responseText = '';
  this.responseXML = null;
  this.readyState = states.UNSENT;

  if (support.response) {
    this.response = '';
  }

  this.responseURL = '';
  this.status = 0;
  this.statusText = '';
}

inherits(XMLHttpRequest, EventTarget);

// https://xhr.spec.whatwg.org/#the-open()-method
XMLHttpRequest.prototype.open = function(method, url, async, username, password) {
  if (typeof method !== 'string') {
    throw new SyntaxError('Invalid method');
  }

  var normalizedMethod = method.toUpperCase();

  if (methods.indexOf(normalizedMethod) === -1 &&
    forbiddenMethods.indexOf(normalizedMethod) !== -1 &&
    method !== normalizedMethod) {
    throw new Error('SecurityError');
  }

  if (methods.indexOf(normalizedMethod) === -1 && forbiddenMethods.indexOf(method) === -1) {
    throw new SyntaxError('Invalid method');
  }

  // fauxJax's specific API
  this.requestMethod = normalizedMethod;
  this.requestUrl = url;

  if (typeof async === 'boolean') {
    this.async = async;
  } else {
    this.async = true;
  }

  this.requestHeaders = {};

  this.username = username;
  this.password = password;

  readyStateChange(this, states.OPENED);
};

// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-setrequestheader
XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
  if (this.readyState !== states.OPENED) {
    throw new Error('InvalidStateError');
  }

  if (this.sendFlag === true) {
    throw new Error('InvalidStateError');
  }

  if (!name || value === undefined) {
    throw new SyntaxError('Missing name or value');
  }

  if (forbiddenHeaderNames.indexOf(name) !== -1) {
    throw new Error('Refused to set unsafe header "' + name + '"');
  }

  this.requestHeaders[name] = value;
};

// https://xhr.spec.whatwg.org/#dom-xmlhttprequest-send
XMLHttpRequest.prototype.send = function(body) {
  if (this.readyState !== states.OPENED) {
    throw new Error('InvalidStateError');
  }

  if (this.sendFlag === true) {
    throw new Error('InvalidStateError');
  }

  this._setTimeoutIfNecessary();

  if (this.requestMethod === 'GET' || this.requestMethod === 'HEAD') {
    this.requestBody = null;
  } else {
    if (this.requestHeaders['Content-Type'] !== undefined) {
      var originalContentType = this.requestHeaders['Content-Type'].split(';')[0];
      this.requestHeaders['Content-Type'] = originalContentType + ';charset=UTF-8';
    } else {
      this.requestHeaders['Content-Type'] = 'text-plain;charset=UTF-8';
    }

    this.requestBody = body;
  }

  this.sendFlag = true;

  dispatchEvent(this, 'loadstart', {
    bubbles: false,
    cancelable: false,
    total: 0,
    loaded: 0,
    lengthComputable: false
  });
};

// https://xhr.spec.whatwg.org/#the-abort()-method
XMLHttpRequest.prototype.abort = function() {
  if (this.readyState > states.UNSENT && this.sendFlag === true) {

    if (support.response) {
      this.response = new Error('NetworkError');
    }

    handleRequestError(this, 'abort');

    return;
  }

  this.responseType = '';
  this.responseText = '';
  this.responseXML = null;
  this.readyState = states.UNSENT;

  if (support.response) {
    this.response = '';
  }

  this.responseURL = '';
  this.status = 0;
  this.statusText = '';

  if (support.timeout) {
    this.timeout = 0;
  }
};

// https://xhr.spec.whatwg.org/#the-getresponseheader()-method
XMLHttpRequest.prototype.getResponseHeader = function(headerName) {
  headerName = headerName.toLowerCase();

  for (var responseHeaderName in this.responseHeaders) {
    if (responseHeaderName.toLowerCase() === headerName) {
      return this.responseHeaders[responseHeaderName];
    }
  }

  return null;
};

XMLHttpRequest.prototype.getAllResponseHeaders = function() {
  if (!this.responseHeaders) {
    return '';
  }

  return this.responseHeaders;
};

XMLHttpRequest.prototype.overrideMimeType = function() {

};

// now onto fauxJax's specific API
XMLHttpRequest.prototype.setResponseHeaders = function(headers) {
  if (!headers) {
    throw new Error('Please specify at least one header when using xhr.setResponseHeaders()');
  }

  if (this.readyState < states.OPENED || this.sendFlag !== true) {
    throw new Error('Call xhr.open() and xhr.send() before using xhr.setResponseHeaders()');
  }

  this.responseHeaders = {};

  var xhr = this;
  Object.keys(headers).forEach(function assignToResponseHeaders(headerName) {
    xhr.responseHeaders[headerName] = headers[headerName];
  });

  readyStateChange(this, states.HEADERS_RECEIVED);
};

XMLHttpRequest.prototype.setResponseBody = function(body) {
  if (typeof body !== 'string') {
    throw new Error('xhr.setResponseBody() expects a String');
  }

  if (this.readyState < states.HEADERS_RECEIVED || this.sendFlag !== true) {
    throw new Error('Call xhr.open(), xhr.send() and xhr.setResponseHeaders() before using xhr.setResponseBody()');
  }

  var chunkSize = 10;
  var index = 0;

  while (index < body.length) {
    this.responseText += body.slice(index, index + chunkSize);
    index += chunkSize;
    readyStateChange(this, states.LOADING);
  }

  if (support.response) {
    if (this.responseType === 'json') {
      this.response = JSON.parse(this.responseText);
    } else {
      this.response = this.responseText;
    }
  }

  if (this._timeoutID) {
    clearTimeout(this._timeoutID);
  }

  readyStateChange(this, states.DONE);
};

XMLHttpRequest.prototype.respond = function(statusCode, headers, body) {
  this.status = statusCode;
  this.statusText = httpStatusCodes[this.status];

  if (headers) {
    this.setResponseHeaders(headers);
  }

  if (body !== undefined) {
    this.setResponseBody(body);
  }
};

XMLHttpRequest.prototype._setTimeoutIfNecessary = function() {
  if (this.timeout > 0 && this._timeoutID === undefined) {
    this._timeoutID = setTimeout(handleRequestError.bind(null, this, 'timeout'), this.timeout);
  }
};

// set XMLHttpRequest.UNSENT etc. like browsers does it
// console.log(XMLHttpRequest.UNSENT), console.log(XMLHttpRequest.prototype.UNSENT)
Object.keys(states).forEach(function setAsStaticAndProto(stateName) {
  XMLHttpRequest[stateName] = states[stateName];
  XMLHttpRequest.prototype[stateName] = states[stateName];
});

function dispatchEvent(eventTarget, type, params) {
  params = params || {};

  var event = new Event(type, {
    bubbles: params.bubbles,
    cancelable: params.cancelable
  });

  event.target = eventTarget;
  event.currentTarget = eventTarget;

  Object
    .keys(params)
    .forEach(function assignToConstructorAndPrototype(paramName) {
      event[paramName] = params[paramName];
    });

  eventTarget.dispatchEvent(event);
}

function readyStateChange(eventTarget, readyState) {
  eventTarget.readyState = readyState;

  dispatchEvent(eventTarget, 'readystatechange', {
    bubbles: false,
    cancelable: false
  });
}

// https://xhr.spec.whatwg.org/#handle-errors
// https://xhr.spec.whatwg.org/#request-error-steps
function handleRequestError(eventTarget, type) {
  readyStateChange(eventTarget, states.DONE);

  dispatchEvent(eventTarget, 'progress', {
    bubbles: false,
    cancelable: false,
    total: 0,
    loaded: 0,
    lengthComputable: false
  });

  dispatchEvent(eventTarget, type, {
    bubbles: false,
    cancelable: false,
    total: 0,
    loaded: 0,
    lengthComputable: false
  });

  dispatchEvent(eventTarget, 'loadend', {
    bubbles: false,
    cancelable: false,
    total: 0,
    loaded: 0,
    lengthComputable: false
  });
}

// https://xhr.spec.whatwg.org/#xmlhttprequestresponsetype
// var responseTypes = [
//   '',
//   'arrayBuffer',
//   'blob',
//   'document',
//   'json',
//   'text'
// ];
