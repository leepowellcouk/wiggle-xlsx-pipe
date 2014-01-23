var ent    = require('ent');
var months = require('./months');
var utils  = require('./utils');

/**
 * Location abbreviations
 */
var locationAbbrs = {
  'north'         : 'N',
  'north west'    : 'NW',
  'west'          : 'W',
  'south west'    : 'SW',
  'south'         : 'S',
  'south east'    : 'SE',
  'east'          : 'E',
  'north east'    : 'NE',
  'east midlands' : 'EMID',
  'west midlands' : 'WMID',
  'greater london': 'GL',
  'wales'         : 'WLS',
  'south wales'   : 'SWLS',
  'north wales'   : 'NWLS',
  'not released'  : 'NR'
};

/**
 * Creates a new event
 *
 * @constructor
 * @param {Object} data The events data object
 * @property {String} eventDate Event date in this format 'dd/mm/yyyy'
 * @property {String} eventName Event name
 * @property {String} eventBadge URL to event badge image
 * @property {String} eventLocation Event location i.e. 'South West'
 * @property {String} eventLoc Event location abbreviation i.e. 'SW'
 * @property {String} eventPostCode Event postcode
 * @property {String} eventDiscipline Event disclipline i.e. 'Cycling'
 * @property {String} eventDescription Event description
 * @property {Array} eventClasses Array of classes that belong to the event
 */
function Event(data) {
  this.eventDate        = utils.parseDate(data[0]);
  this.eventName        = data[1];
  this.eventBadge       = '';
  this.eventLocation    = data[5];
  this.eventLoc         = getLocationAbbr(data[5]);
  this.eventPostCode    = data[6];
  this.eventDiscipline  = data[7];
  this.eventDescription = ent.encode(data[8]);
  this.eventClasses     = [];
}

/**
 * Returns the event month in readable case i.e. 'January'
 */
Event.prototype.getMonth = function () {
  if (this.eventDate !== null) {
    var parts = this.eventDate.split('/');
    return months[Number(parts[1]) - 1];
  }
  return false;
};

/**
 * Adds an event class to the event
 *
 * @param {Object} eventclass EventClass instance
 * @returns {Event} For chaining
 */
Event.prototype.addClass = function (val) {
  this.eventClasses.push(val);
  return this;
};

/**
 * Gets location abbreviation
 *
 * @private
 * @retuns {String} Location abbreviation
 * @throws {Error} If the location cannot be found
 */
function getLocationAbbr(location) {
  var loc = location.trim().toLowerCase();
  var abbr = locationAbbrs[loc];
  if (abbr === undefined) {
    throw new Error('Location Abbr not found for "'+loc+'".');
  }
  return abbr;
}

module.exports = Event;
