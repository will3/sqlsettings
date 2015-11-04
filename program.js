var fs = require('fs');
var parseSettings = require('./sqlsettings');
var stdout = require('stdout-stream');

var program = require('commander');
program
  .version('0.0.1')
  .option('-i --input [value]', 'input path')

var inputPath = program.input || 'settings';

var headers = [];

var data = fs.readFileSync(inputPath, 'utf8');

var parsed = parseSettings(data);

stdout.write(parsed);