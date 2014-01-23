var utils = require('./utils');

/**
 * Creates a new EventClass
 *
 * @constructor
 * @param {Object} data The eventclass data object
 * @property {String} classTitle Class name
 * @property {String} classDifficulty Class difficulty
 * @property {String} classDistance Class distance
 * @property {String} classDate Class date in this format 'dd/mm/yyyy'
 * @property {String} skuUrl URL to class information
 * @property {String} pid ID for class
 */
function EventClass(data) {
  this.classTitle = data[1];
  this.classDifficulty = data[9];
  this.classDistance = data[10];
  this.classDate = utils.parseDate(data[0]);
  this.skuUrl = data[11];
  this.pid = data[4];
}

module.exports = EventClass;
