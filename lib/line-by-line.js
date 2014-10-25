var lineReader = require('line-reader');

function handleReader(reader, delay, callback) {
  if (reader.hasNextLine()) {
    reader.nextLine(callback);
    setTimeout(handleReader.bind(null, reader, delay, callback), delay);
  } else {
    reader.close();
  }
}

function lineByLine(file, delay, callback) {
  lineReader.open(file, function(reader) {
    handleReader(reader, delay, callback);
  });
}

// var lineByLine = require './lib/line-by-line'
// lineByLine('./test/test_data.csv', 1000, function(line) {
//   console.log(line);
// });

module.exports = lineByLine;
