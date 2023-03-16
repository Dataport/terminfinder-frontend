const du = require('./src/locales/de-DE-du.json');
const sie = require('./src/locales/de-DE-sie.json');
const en = require('./src/locales/en-EN.json');

let error = false;

function compareJsonContents(baseFile, testFile, path) {
  let differences = [];

  const baseKeys = Object.keys(baseFile);
  const testKeys = Object.keys(testFile);

  for (const key of baseKeys) {
    if (!testKeys.includes(key)) {
      differences.push({[path + '/' + key]: 'no key in test file'});
      continue;
    }
    if (typeof baseFile[key] !== typeof testFile[key]) {
      differences.push({[path + '/' + key]: 'different types: ' + typeof baseFile[key] + ' vs. ' + testFile[key]});
      continue;
    }
    if (typeof baseFile[key] !== 'string') {
      differences = differences.concat(compareJsonContents(baseFile[key], testFile[key], [path + '/' + key]));
    }
  }
  return differences;
}

function checkForEmptyValues(file, path) {
  let emptyValues = [];
  for (const key in file) {
    if (typeof file[key] === 'string') {
      if (file[key] === '') {
        emptyValues.push({[path + '/' + key]: 'emptyValue'});
      }
    } else {
      emptyValues = emptyValues.concat(checkForEmptyValues(file[key], [path + '/' + key]));
    }
  }
  return emptyValues;
}

function showResult(base, test, baseName, testName) {
  let results =
    [].concat(checkForEmptyValues(base, baseName))
      .concat(checkForEmptyValues(test, testName))
      .concat(compareJsonContents(base, test, testName))
      .concat(compareJsonContents(test, base, baseName));

  if (results.length !== 0) {
    console.error('ERROR');
    console.error(results);
    error = true;
  }
}

showResult(du, sie, 'de-DE-du.json', 'de-DE-sie.json');
showResult(du, en, 'de-DE-du.json', 'en-EN.json');

if (error) {
  throw('There are i18n locale errors!');
}
