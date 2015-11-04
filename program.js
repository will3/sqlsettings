var fs = require('fs');
var SqlSettings = require('./sqlsettings');
var sqlSettings = new SqlSettings();
var stdout = require('stdout-stream');

var program = require('commander');
program
  .version('0.0.1')
  .option('-i --input [value]', 'input path')

var inputPath = program.input || 'settings';

var headers = [];

var data = fs.readFileSync(inputPath, 'utf8');

var parsed = sqlSettings.parseRaw(data);

stdout.write(parsed);