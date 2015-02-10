var xhr = new XMLHttpRequest();

module.exports = {
  response: 'response' in xhr,
  cors: 'withCredentials' in xhr,
  timeout: 'timeout' in xhr,
  XDR: 'XDomainRequest' in global
};
