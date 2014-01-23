var commander   = require('commander');
var fs          = require('fs');
var xslxParse   = require('excel');
var ArrayStream = require('arraystream');
var utils       = require('./lib/utils');
var months      = require('./lib/months');
var streams     = require('./lib/streams');

// Parse cli arguments
commander
  .version('0.0.1')
  .usage('node app.js --in [input file] --out [output file]')
  .option('-i, --in <path>', 'An input file')
  .option('-o, --out <path>', 'An output file')
  .parse(process.argv);

// Set input/output paths
var inputfile   = commander.in;
var outputfile  = commander.out;

if (inputfile === undefined) {
  utils.displayError('--in file was not specified.');
}

if (!fs.existsSync(inputfile)) {
  utils.displayError('--in file does not exist.');
}

if (outputfile === undefined) {
  utils.displayError('--out file was not specified.');
}

// Create file write stream with output path
streams.createFileOutStream(__dirname + '/output/' + outputfile);

// Kick off the parsing process...
xslxParse(commander.in, function xslxParseCallback (err, data) {
  if (err) {
    utils.displayError('Could not parse xslx file - ' + err);
  }

  // Remove the first line of data containing the column headings
  data.shift();

  // Setup stream event handlers
  streams.fileout.on('finish', function () {
    console.log('--- Finished');
  });

  console.log('--- Processing Events');

  ArrayStream.create(data)
    .pipe(streams.createEvent)
    .pipe(streams.eventToMonth)
    .pipe(streams.dataTransform)
    .pipe(streams.stringify)
    .pipe(streams.fileout);
});
