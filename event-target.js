module.exports = EventTarget;

var EventEmitter = require('events').EventEmitter;

function EventTarget(events) {
  var eventTarget = this;
  this._eventEmitter = new EventEmitter();

  events.forEach(function setToNull(evName) {
    eventTarget['on' + evName] = null;
  });
}

EventTarget.prototype.addEventListener = function(type, callback/*, capture*/) {
  this._eventEmitter.addListener(type, callback);
};

EventTarget.prototype.removeEventListener = function(type, callback/*, capture*/) {
  this._eventEmitter.removeListener(type, callback);
};

EventTarget.prototype.dispatchEvent = function(event) {
  if (typeof this['on' + event.type] === 'function') {
    this['on' + event.type](event);
  }

  this._eventEmitter.emit(event.type, event);

  return event.cancelable === false || event.defaultPrevented === undefined;
};
