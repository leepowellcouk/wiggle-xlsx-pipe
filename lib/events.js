var months = require('./months');
var events = {};

// Loop over months and set up events object
months.forEach(function (val) {
  events[val] = [];
});

// Add a 'TBC' property on the events object for events with invalid dates
events.TBC = [];

module.exports = events;
