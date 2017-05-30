(function matrix() {

  'strict';

  var colors = ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac']

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
    data = d3.csv.parseRows(data, function (row, y) {

      // Create sources from header 
      if (y === 0) {

        for (var x = 0; x < row.length; x++) {

          sources.push(row[x])
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
              x: +x,
              y: +y
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

    var min = d3.min(data.edges, function (d) { return d.weight; });
    var max = d3.max(data.edges, function (d) { return d.weight; });

    var color = d3.scale.quantile()
      .domain([min, max])
      .range(colors);

    // var squareSize = (width - margins.right) / data.sources.length;
    var squareSize = 20;

    var svg = chart.append('svg')
      .attr('width', width)
      .attr('height', height);

    var group = svg.append('g');

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

    var rects

    var cells = group.selectAll('.cell')
        .data(data.edges)
        .enter()
      .append('rect')
        .attr('width', squareSize - 2)
        .attr('height', squareSize - 2)
        .attr('x', function (d) { return d.x * squareSize })
        .attr('y', function (d) { return d.y * squareSize })
        .attr('fill', function (d) { return color(d.weight); })
        .on('mouseenter', function (d) { console.log(d); })
  }
})();
