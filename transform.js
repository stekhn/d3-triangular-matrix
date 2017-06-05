var transform = (function() {

  'use strict';

  var fs = require('fs');
  var path = require('path');
  var d3 = require('d3');

  // Configuration
  var inputFile = 'data.csv';
  var outputFile = 'data.json';

  (function init() {

    load(inputFile);
  }());

  function load(filePath) {

    fs.readFile(filePath, 'utf8', function (error, body) {

      if (error) { console.error(error); }

      process(body);
    });
  }

  function process(fileBody) {

    var sources = [];
    var targets = [];
    var edges = [];

    // Parse CSV row by row
    d3.csv.parseRows(fileBody, function (row, y) {

      // Create sources from header
      if (y === 0) {

        for (var x = 0; x < row.length; x++) {

          sources.push(row[x]);
        }

      // Create targets and edges from remaining rows
      } else {

        for (var x = 0; x < row.length; x++) {

          // Check if cell is has content and was not linked yet
          if (sources[x] && targets.indexOf(sources[x]) < 0) {

            edges.push({
              source: sources[x],
              target: row[0],
              weight: +row[x],
              x: +x - 1,
              y: +y - 1
            });
          }
        }

        // Add current row to list of known targets
        targets.push(row[0]);
      }
    });

    // Remove empty entry from sources array;
    sources.shift();

    save(outputFile, JSON.stringify(edges, null, 2));
  }

  function save(filePath, string) {

    // Normalize file path
    filePath = path.normalize(filePath);

    try {

      console.log('Saved file', filePath);

      return fs.writeFileSync(filePath, string, 'utf8');
    } catch (error) {

      console.error(error);
    }
  }
}());
