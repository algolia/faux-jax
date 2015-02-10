var support = require('./support');

var native = module.exports = {};

if (support.hasXMLHttpRequest) {
  native.XMLHttpRequest = global.XMLHttpRequest;
}
