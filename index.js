module.exports = FauxJax;

var util = require('util');

var Event = require('./event');
var EventTarget = require('./event-target');

var events = require('./events');
var forbiddenHeaderNames = require('./forbidden-header-names');
var forbiddenMethods = require('./forbidden-methods');
var httpStatusCodes = require('./http-status-codes');
var methods = require('./methods.js');
var states = require('./states');
var support = require('./support');

// https://xhr.spec.whatwg.org/#constructors
function FauxJax() {
  EventTarget.call(this, events);

  this.readyState;

  this.timeout = 0;

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

util.inherits(FauxJax, EventTarget);

// https://xhr.spec.whatwg.org/#the-open()-method
FauxJax.prototype.open = function(method, url, async, username, password) {
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

  this.method = normalizedMethod;
  this.url = url;

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
FauxJax.prototype.setRequestHeader = function(name, value) {
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
FauxJax.prototype.send = function(body) {
  if (this.readyState !== states.OPENED) {
    throw new Error('InvalidStateError');
  }

  if (this.sendFlag === true) {
    throw new Error('InvalidStateError');
  }

  if (this.method === 'GET' || this.method === 'HEAD') {
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
FauxJax.prototype.abort = function() {
  if (this.readyState > states.UNSENT && this.sendFlag === true) {

    if (support.response) {
      this.response = new Error('NetworkError');
    }

    readyStateChange(this, states.DONE);

    dispatchEvent(this, 'progress', {
      bubbles: false,
      cancelable: false,
      total: 0,
      loaded: 0,
      lengthComputable: false
    });

    dispatchEvent(this, 'abort', {
      bubbles: false,
      cancelable: false,
      total: 0,
      loaded: 0,
      lengthComputable: false
    });

    dispatchEvent(this, 'loadend', {
      bubbles: false,
      cancelable: false,
      total: 0,
      loaded: 0,
      lengthComputable: false
    });

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
  this.timeout = 0;
};

// https://xhr.spec.whatwg.org/#the-getresponseheader()-method
FauxJax.prototype.getResponseHeader = function(headerName) {
  headerName = headerName.toLowerCase();

  for (var responseHeaderName in this.responseHeaders) {
    if (responseHeaderName.toLowerCase() === headerName) {
      return this.responseHeaders[responseHeaderName];
    }
  }

  return null;
};

FauxJax.prototype.getAllResponseHeaders = function() {
  if (!this.responseHeaders) {
    return '';
  }

  return this.responseHeaders;
};

FauxJax.prototype.overrideMimeType = function() {

};

// now onto fauxJax's specific API
FauxJax.prototype.setResponseHeaders = function(headers) {
  var fauxJax = this;

  if (this.readyState < states.OPENED || this.sendFlag !== true) {
    throw new Error('InvalidStateError. Call xhr.open() and xhr.send() before using xhr.setResponseHeaders()');
  }

  headers = headers || {};
  this.responseHeaders = {};

  Object.keys(headers).forEach(function(headerName) {
    fauxJax.responseHeaders[headerName] = headers[headerName];
  });

  readyStateChange(this, states.HEADERS_RECEIVED);
};

FauxJax.prototype.setResponseBody = function(body) {
  if (this.readyState < states.HEADERS_RECEIVED || this.sendFlag !== true) {
    throw new Error('InvalidStateError. Call xhr.open(), xhr.send() and xhr.setResponseHeaders() before using xhr.setResponseBody()');
  }

  if (typeof body !== 'string') {
    throw new SyntaxError('xhr.setResponseBody() expects a String');
  }

  var chunkSize = 10;
  var index = 0;

  while (index < body.length) {
    readyStateChange(this, states.LOADING);

    this.responseText += body.slice(index, index + chunkSize);
    index += chunkSize;
  }

  if (support.response) {
    if (this.responseType === 'json') {
      this.response = JSON.parse(this.responseText);
    } else {
      this.response = this.responseText;
    }
  }

  readyStateChange(this, states.DONE);
};

FauxJax.prototype.respond = function(statusCode, headers, body) {
  this.status = statusCode;
  this.statusText = httpStatusCodes[this.status];

  if (headers) {
    this.setResponseHeaders(headers);
  }

  if (body !== undefined) {
    this.setResponseBody(body);
  }
};

// set fauxJax.UNSENT etc. like browsers does it
// console.log(XMLHttpRequest.UNSENT), console.log(XMLHttpRequest.prototype.UNSENT)
Object.keys(states).forEach(function setAsStaticAndProto(stateName) {
  FauxJax[stateName] = states[stateName];
  FauxJax.prototype[stateName] = states[stateName];
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

// https://xhr.spec.whatwg.org/#xmlhttprequestresponsetype
// var responseTypes = [
//   '',
//   'arrayBuffer',
//   'blob',
//   'document',
//   'json',
//   'text'
// ];
