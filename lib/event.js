// https://dom.spec.whatwg.org/#event

module.exports = Event;

// https://dom.spec.whatwg.org/#dom-event-none
var eventPhases = {
  NONE: 0,
  CAPTURING_PHASE: 1,
  AT_TARGET: 2,
  BUBBLING_PHASE: 3
};

// https://dom.spec.whatwg.org/#event
function Event(type, eventInitDict) {
  this.type = type;
  this.bubbles = eventInitDict.bubbles;
  this.cancelable = eventInitDict.cancelable;

  this.target = null;
  this.currentTarget = null;
  this.eventPhase = eventPhases.NONE;

  this.timestamp = Date.now();
}

Event.prototype.stopPropagation = function() {

};

Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
};

Object
  .keys(eventPhases)
  .forEach(function assignToConstructorAndPrototype(eventPhaseName) {
    Event[eventPhaseName] = eventPhases[eventPhaseName];
    Event.prototype[eventPhaseName] = eventPhases[eventPhaseName];
  });
