(function matrix() {

  'strict';

  var margins = {
    top: 120,
    right: 120,
    bottom: 0,
    left: 0
  };

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

    // Remove empty entry from sources array;
    sources.shift();

    return {
      sources: sources,
      targets: targets,
      edges: edges,
    };
  }

  function draw(data) {

    var chart = d3.select('.chart');

    var width = parseFloat(chart.style('width'));
    var height = parseFloat(chart.style('height'));

    // var squareSize = (width - margins.right) / data.sources.length;
    var squareSize = 20;

    var svg = chart.append('svg')
      .attr('width', width)
      .attr('height', height);

    var group = svg.append('g')

    var rows = group.selectAll('.rows')
        .data(data.sources)
        .enter()
      .append('g')
        .attr('class', 'row')
        .attr('dominant-baseline', 'text-before-edge')
        .attr('transform', function (d, i) {
          return 'translate(0,' + (margins.top + (i * squareSize)) + ')';
        });

    rows.append('text')
      .attr('x', width - margins.right + squareSize)
      .attr('dy', 3)
      .text(function (d) { return d; });

    var columms = group.selectAll('.column')
      .data(data.targets)
      .enter()
    .append('g')
      .attr('class', 'column')
      .attr('dominant-baseline', 'text-before-edge')
      .attr('transform', function (d, i) {
        return 'translate(' + i * squareSize + ',' + margins.top +') rotate(-90)';
      });

    columms.append('text')
      .attr('x', 0)
      .attr('dy', 3)
      .text(function (d) { return d; });

    var cells = rows.selectAll('.cell')
        .data(data.targets)
        .enter()
      .append('rect')
        .attr('width', squareSize - 2)
        .attr('height', squareSize - 2)
        .attr ('x', function (d, i) {
          return squareSize * i;
        })
        .attr('fill', 'black');
  }
})();
