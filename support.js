var hasXMLHttpRequest = 'XMLHttpRequest' in global;
var hasXDomainRequest = 'XDomainRequest' in global;

var support = module.exports = {};

if (hasXMLHttpRequest) {
  support.response = 'response' in new XMLHttpRequest();
  support.cors = 'withCredentials' in new XMLHttpRequest();
  support.timeout = 'timeout' in new XMLHttpRequest();
}

if (hasXDomainRequest) {
  support.hasXDomainRequest = true;
}
