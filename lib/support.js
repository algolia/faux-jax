var browser = require('bowser').browser;

var hasXMLHttpRequest = 'XMLHttpRequest' in global;
var hasXDomainRequest = 'XDomainRequest' in global;

var support = module.exports = {};

if (hasXMLHttpRequest) {
  support.xhr = {};

  support.xhr.response = 'response' in new XMLHttpRequest();
  support.xhr.cors = 'withCredentials' in new XMLHttpRequest();
  support.xhr.timeout = 'timeout' in new XMLHttpRequest();
  support.xhr.addEventListener = 'addEventListener' in new XMLHttpRequest();
  support.xhr.responseURL = 'responseURL' in new XMLHttpRequest();

  support.xhr.events = {};
  support.xhr.events.loadstart = 'onloadstart' in new XMLHttpRequest();
  support.xhr.events.progress = 'onprogress' in new XMLHttpRequest();
  support.xhr.events.abort = 'onabort' in new XMLHttpRequest();
  support.xhr.events.error = 'onerror' in new XMLHttpRequest();
  support.xhr.events.load = 'onload' in new XMLHttpRequest();
  support.xhr.events.timeout = 'ontimeout' in new XMLHttpRequest();
  support.xhr.events.loadend = 'onloadend' in new XMLHttpRequest();
  support.xhr.events.readystatechange = 'onreadystatechange' in new XMLHttpRequest();
}

if (hasXDomainRequest) {
  support.xdr = {};

  // XDomainRequest implementations are using the same set of features
  // Only difference is that IE8 does not sends `event` objects in event listeners
  // And other browsers never sends `event` objects in `progress` listener

  if (browser.msie && browser.version === '8.0') {
    support.xdr.eventObjects = [];
  } else {
    support.xdr.eventObjects = ['load', 'error', 'timeout'];
  }
}
