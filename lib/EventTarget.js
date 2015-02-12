module.exports = getEventTarget;

var EventEmitter = require('events').EventEmitter;
var support = require('./support');

function getEventTarget(opts) {
  var forEach = require('lodash-compat/collection/forEach');

  opts = opts || {};

  function EventTarget(events) {
    var eventTarget = this;

    if (support.addEventListener && opts.addEventListener !== false) {
      this._eventEmitter = new EventEmitter();
    }

    forEach(events, function setToNull(evName) {
      eventTarget['on' + evName] = null;
    });
  }

  if (support.addEventListener && opts.addEventListener !== false) {
    EventTarget.prototype.addEventListener = function(type, callback/*, capture*/) {
      this._eventEmitter.addListener(type, callback);
    };

    EventTarget.prototype.removeEventListener = function(type, callback/*, capture*/) {
      this._eventEmitter.removeListener(type, callback);
    };
  }

  EventTarget.prototype.dispatchEvent = function(event) {
    // XDomainRequest specific progress event where there's no
    // event object sent
    if (typeof event === 'string' && typeof this['on' + event] === 'function') {
      return this['on' + event]();
    }

    if (typeof this['on' + event.type] === 'function') {
      this['on' + event.type](event);
    }

    if (support.addEventListener && opts.addEventListener !== false) {
      this._eventEmitter.emit(event.type, event);
    }

    return event.cancelable === false || event.defaultPrevented === undefined;
  };

  return EventTarget;
}
