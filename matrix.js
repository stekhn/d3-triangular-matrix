(function matrix() {

  'strict';

  var colors = ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'];

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
    d3.csv.parseRows(data, function (row, y) {

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

    return {
      sources: sources,
      edges: edges,
      targets: targets
    };
  }

  function draw(data) {

    var chart = d3.select('.chart');

    var width = parseFloat(chart.style('width'));
    var height = width;

    var min = d3.min(data.edges, function (d) { return d.weight; });
    var max = d3.max(data.edges, function (d) { return d.weight; });

    var color = d3.scale.quantile()
      .domain([min, max])
      .range(colors);

    var squareDiagonal = Math.sqrt(Math.pow(data.sources.length, 2) + Math.pow(data.targets.length, 2));
    var squareSize = (width - margins.left - margins.right) / squareDiagonal;
    var scaleSize = squareSize * Math.min(data.sources.length, data.targets.length);

    var xScale = d3.scale.ordinal()
      .domain(data.edges.map(function (d) { return d.source; }))
      .rangePoints([0, scaleSize], 1);

    var yScale = d3.scale.ordinal()
      .domain(data.edges.map(function (d) { return d.target; }))
      .rangePoints([0, scaleSize], 1);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('top')
      .tickSize(0);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('right')
      .tickSize(0);

    var svg = chart.append('svg')
      .attr('width', width)
      .attr('height', height);

    var group = svg.append('g')
      .attr('transform', 'translate(0,' + height / 2 + ') rotate(-45)');

    group.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + margins.top + ')')
        .call(xAxis)
      .selectAll('text')
        .attr('dy', '.5em')
        .attr('transform', 'rotate(90)')
        .style('text-anchor', 'end');

    group.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + scaleSize + ',' + margins.top +')')
      .call(yAxis);

    var cells = group.append('g')
      .attr('class', 'cells')
      .attr('transform', 'translate(0,' + margins.top + ')');

    cells.selectAll('.cell')
        .data(data.edges)
        .enter()
      .append('rect')
        .attr('width', squareSize - 2)
        .attr('height', squareSize - 2)
        .attr('x', function (d) { return d.x * squareSize; })
        .attr('y', function (d) { return d.y * squareSize; })
        .attr('fill', function (d) { return color(d.weight); })
        .on('mouseenter', function (d) { console.log(d); });
  }
})();
