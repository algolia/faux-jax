var hasXMLHttpRequest = 'XMLHttpRequest' in global;
var hasXDomainRequest = 'XDomainRequest' in global;

var support = module.exports = {};

if (hasXMLHttpRequest) {
  support.xhr = {};

  support.hasXMLHttpRequest = true;
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
  support.hasXDomainRequest = true;
}
