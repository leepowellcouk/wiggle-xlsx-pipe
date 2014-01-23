/**
 * Trims string elements - ideal to use with Array.prototype.map
 * Example: [' foo ', ' bar'].map(trim);
 *
 * @param {String} str String
 * @returns {String}
 */
function trim(str) {
  return str.trim();
}

/**
 * Parses and formats a numeric date to dd/mm/yyyy
 *
 * @param {Number} date XSLX parsed date which is the number of days since 1-1-1900, https://github.com/trevordixon/excel.js/issues/17
 * @returns {String|Null} Returns formatted date (dd/mm/yyyy) if a valid date is passed
 */
function parseDate(date) {
  var dateObj = new Date();
  date = Number(date);
  if (!isNaN(date)) {
    dateObj.setTime((date - 25569) * 24 * 3600 * 1000);
    return pad(dateObj.getDate(), 2) + '/'+ pad(dateObj.getMonth() + 1, 2) + '/' + dateObj.getFullYear();
  }
  else {
    return null;
  }
}

/**
 * Pads a string to the left with '0'
 *
 * @param {String} str String to pad
 * @param {Number} width Total width of the final padded string
 * @returns {String} Padded string
 */
function pad(str, width) {
  var len = Math.max(0, width - String(str).length);
  return Array(len + 1).join('0') + str;
}

/**
 * Displays error to console and exits program
 *
 * @param {String} str Error message to display
 */
function displayError(str) {
  console.error();
  console.error("Error: %s", str);
  console.error();
  process.exit(1);
}

module.exports = {
  trim: trim,
  parseDate: parseDate,
  pad: pad,
  displayError: displayError
};
