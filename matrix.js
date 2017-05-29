(function matrix() {

  'strict';

  (function init() {

    d3.text('data.csv', function (data) {

      draw(transform(data));
    });
  })();

  function transform(data) {

    var sources = [];
    var targets = [];
    var edges = [];

    // Parse CSV row by row
    data = d3.csv.parseRows(data, function (row, i) {

      // Create sources from header 
      if (i === 0) {

        for (var cell in row) {

          sources.push(row[cell])
        }

      // Create targets and edges from remaining rows
      } else {

        for (var cell in row) {

          // Check if cell is has content and was not linked yet  
          if (sources[cell] && targets.indexOf(sources[cell]) < 0) {

            edges.push({
              source: sources[cell],
              target: row[0],
              weight: row[cell]
            })
          }
        }

        // Add current row to list of known targets
        targets.push(row[0])
      }
    })

    return {
      sources: source,
      targets: target,
      edges: edges,
    };
  }

  function draw(edges) {

    
  }
})();
