var matrix = (function() {

  'strict';

  var colors = ['#f0f9e8','#ccebc5','#a8ddb5','#7bccc4','#43a2ca','#0868ac'];
  var margin = 120;

  (function init() {

    d3.csv('data.csv')
      .row(row)
      .get(function (data) {

        draw(data);
      });
  })();

  function row(d) {

    return {
      source: d.source,
      target: d.target,
      weight: parseFloat(d.weight)
    };
  }

  function draw(data) {

    var chart = d3.select('.chart');

    var width = parseFloat(chart.style('width'));
    var height = (width / 2) + margin;

    var min = d3.min(data, function (d) { return d.weight; });
    var max = d3.max(data, function (d) { return d.weight; });

    var color = d3.scaleQuantile()
      .domain([min, max])
      .range(colors);

    var sources = d3.nest()
      .key(function(d) { return d.source; })
      .entries(data);

    var targets = d3.nest()
      .key(function(d) { return d.source; })
      .entries(data);

    var count = sources.length;
    var squareDiagonal = Math.sqrt(Math.pow(count, 2) + Math.pow(count, 2));
    var squareSize = (width - margin) / squareDiagonal;
    var scaleSize = squareSize * Math.min(count, count);

    var x = d3.scaleBand()
      .domain(sources.map(function (d) { return d.key; }))
      .range([0, scaleSize], 1);

    var y = d3.scaleBand()
      .domain(targets.map(function (d) { return d.key; }))
      .range([0, scaleSize], 1);

    var xAxis = d3.axisTop(x)
      .tickSize(0);

    var yAxis = d3.axisRight(y)
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

    group.append('g')
        .attr('transform', 'translate(0,' + margin + ')')
      .selectAll('rect')
        .data(data)
        .enter()
      .append('rect')
        .attr('width', squareSize - 2)
        .attr('height', squareSize - 2)
        .attr('x', function (d) { return x(d.source); })
        .attr('y', function (d) { return y(d.target); })
        .attr('fill', function (d) { return color(d.weight); })
        .on('mouseenter', function (d) { console.log(d); });
  }
})();
