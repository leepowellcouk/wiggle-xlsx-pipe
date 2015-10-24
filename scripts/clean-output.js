var del = require('del');
var chalk = require('chalk');

del(['output/*.json']).then(function () {
  console.log(chalk.green('--- Output directory cleaned ---'));
});
