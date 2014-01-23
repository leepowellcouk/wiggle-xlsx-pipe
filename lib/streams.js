var fs         = require('fs');
var through    = require('through');
var Event      = require('./event');
var EventClass = require('./eventclass');
var eventBadge = require('./eventbadge');
var events     = require('./events');
var utils      = require('./utils');
var curEvent   = null;
var streams    = {};

/**
 * Creates an event
 * Note: Each buffer is an single line array from the parsed XSLX file
 */
streams.createEvent = through(
  function (buf) {
    var self      = this;
    var eventData = buf.map(utils.trim);
    var url       = eventData[11];
    var type      = eventData[12];
    var promise;

    // Log event name for brevity
    console.log(eventData[1]);

    // Create event
    if (type === 'event') {
      // Handling a new event? pipe the previous one out
      if (curEvent !== null) {
        self.queue(curEvent);
      }

      curEvent = new Event(eventData);

      if (url !== undefined && url !== '' && url.match(/^http/)) {
        // Pause the stream while fetch the event badge
        this.pause();

        // Request the event badge - returns a promise
        promise = eventBadge(eventData[11]);

        // Event badge has finished, and the promise is resolved
        promise.then(function (val) {
          curEvent.eventBadge = val;
          // Resume the stream
          self.resume();
        });
      }
    }
    // Create event class
    else {
      curEvent.addClass(new EventClass(eventData));
    }
  },
  function () {
    // At the end we must pipe out the final current event, otherwise it's missed
    // due to no more events coming down to push it out
    this.queue(curEvent);

    // Indicate the end of the stream
    this.queue(null);
  }
);

/**
 * Allocates event to correct month in events object
 * Note: Each buffer is a single event
 */
streams.eventToMonth = through(
  function (buf) {
    var month = buf.getMonth();
    // If there's a valid month, push into that, otherwise push to 'tbc'
    events[month === false ? 'TBC' : month].push(buf);
  },
  function () {
    // The pipe of events has finished... pipe the whole events object out
    this.queue(events);
    this.queue(null);
  }
);

/**
 * Transforms the final events object into the required output structure
 */
streams.dataTransform = through(
  function (buf) {
    var result   = {};
    var month    = {};
    var key;

    result.month = [];

    for (key in buf) {
      if (buf.hasOwnProperty(key)) {
        month = {
          monthName: key,
          event: buf[key]
        };
        result.month.push(month);
      }
    }

    this.queue(result);
  }
);

/**
 * JSON stringify the buffer
 * Note: The buffer should contain the full object to stringify and not chunked
 */
streams.stringify = through(function (buf) {
  if (buf === null) return;
    this.queue(JSON.stringify(buf, null, 2));
  }
);

/**
 * Creates file write stream
 *
 * @param {String} Path to output file
 */
streams.createFileOutStream = function (path) {
  this.fileout = fs.createWriteStream(path);
};

module.exports = streams;
