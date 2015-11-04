var _ = require('lodash');

module.exports = function(data) {
  var read = function(row, key) {
    var index = _.indexOf(headers, key);
    if (index === -1) {
      throw new Error('cannot find column ' + key);
    }

    return row[index];
  };

  var mobilePrefix = 'Mobile_';
  var vistaPrefix = 'vista_';

  var normalizeSettingName = function(name) {
    var index = name.indexOf(mobilePrefix);
    if (index === -1 || index !== 0) {
      throw new Error('not a mobile setting: ' + name);
    }

    var trimmed = name.substring(index + mobilePrefix.length);

    return vistaPrefix + trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  };

  var normalizeSettingValue = function(value, type, validation) {
    if (type === 'string') {
      if (validation === 'Yes-No') {
        if (value === 'Yes') {
          return true;
        } else if (value === 'No') {
          return false;
        }

        throw new Error('error parsing setting value with params: ' + [value, type, validation].join(', '));
      }

      return value;
    } else if (type === 'integer') {
      return parseInt(type);
    }

    throw new Error('unsupported type: ' + type);
  };

  var settings = {};

  var lines = data.split('\n');
  var count = 0;

  lines.forEach(function(line) {
    var row = line.split('\t');

    if (count === 0) {
      headers = row;
      count++;
      return;
    }

    var name = read(row, 'Configure_strName');
    var value = read(row, 'Configure_strValue');
    var type = read(row, 'Configure_strType');
    var validation = read(row, 'Configure_strValidation');

    var settingValue = normalizeSettingValue(value, type, validation);
    var settingKey = normalizeSettingName(name);
    if (settingValue.length === 0) {
      return;
    }

    settings[settingKey] = settingValue;

    count++;
  });

  return JSON.stringify({
    'Settings': settings
  }, null, 4);
};