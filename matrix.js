(function matrix() {

  'strict';

  var colors = ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'];
  var margin = 120;

  (function init() {

    d3.json('data.json', function (data) {

      draw(transform(data));
    });
  })();

  function transform(data) {

    // @todo Add sorting and entitiy count here
    data = data.sort(function (a, b) {
      return d3.descending(a.weight, b.weight);
    });

    return data;
  }

  function draw(data) {

    var chart = d3.select('.chart');

    var width = parseFloat(chart.style('width'));
    var height = (width / 2) + margin;

    var min = d3.min(data, function (d) { return d.weight; });
    var max = d3.max(data, function (d) { return d.weight; });

    var color = d3.scale.quantile()
      .domain([min, max])
      .range(colors);

    // @todo Calculate count from data
    var count = 25;

    var squareDiagonal = Math.sqrt(Math.pow(count, 2) + Math.pow(count, 2));
    var squareSize = (width - margin) / squareDiagonal;
    var scaleSize = squareSize * Math.min(count, count);

    var xScale = d3.scale.ordinal()
      .domain(data.map(function (d) { return d.x; }))
      .rangePoints([0, scaleSize], 1);

    var yScale = d3.scale.ordinal()
      .domain(data.map(function (d) { return d.y; }))
      .rangePoints([0, scaleSize], 1);

    console.log(xScale.range());
    console.log(yScale.range());

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
      .attr('transform',
        'translate(' + -Math.abs(squareSize) + ',' + ((scaleSize / 2) + margin) + ') ' +
        'rotate(-45)');

    group.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + margin + ')')
        .call(xAxis)
      .selectAll('text')
        .attr('dy', '.5em')
        .attr('transform', 'rotate(90)')
        .style('text-anchor', 'end');

    group.append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + scaleSize + ',' + margin +')')
      .call(yAxis);

    var cells = group.append('g')
      .attr('class', 'cells')
      .attr('transform', 'translate(0,' + margin + ')');

    cells.selectAll('.cell')
        .data(data)
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
