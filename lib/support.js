var hasXMLHttpRequest = 'XMLHttpRequest' in global;
var hasXDomainRequest = 'XDomainRequest' in global;

var support = module.exports = {};

if (hasXMLHttpRequest) {
  support.hasXMLHttpRequest = true;
  support.response = 'response' in new XMLHttpRequest();
  support.cors = 'withCredentials' in new XMLHttpRequest();
  support.timeout = 'timeout' in new XMLHttpRequest();
  support.addEventListener = 'addEventListener' in new XMLHttpRequest();
  support.responseURL = 'responseURL' in new XMLHttpRequest();

  support.events = {};
  support.events.loadstart = 'onloadstart' in new XMLHttpRequest();
  support.events.progress = 'onprogress' in new XMLHttpRequest();
  support.events.abort = 'onabort' in new XMLHttpRequest();
  support.events.error = 'onerror' in new XMLHttpRequest();
  support.events.load = 'onload' in new XMLHttpRequest();
  support.events.timeout = 'ontimeout' in new XMLHttpRequest();
  support.events.loadend = 'onloadend' in new XMLHttpRequest();
  support.events.readystatechange = 'onreadystatechange' in new XMLHttpRequest();
}

if (hasXDomainRequest) {
  support.hasXDomainRequest = true;
}
