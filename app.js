// Add title
d3.select("#main")
  .append("h1")
  .attr("id", "title")
  .text("Movie Sales");

// Add description
d3.select("#main")
  .append("p")
  .attr("id", "description")
  .html("Top 100 Highest Grossing Movies Grouped By Genre");

const tooltip = d3.select("#main")
  .append("div")
  .attr("id", "tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3.select('#main')
  .append('svg')
  .attr('width', 960)
  .attr('height', 700);

d3.json('https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json', (error, data) => {

  if (error) throw error;

  const root = d3.hierarchy(data);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const treemapLayout = d3.treemap()
    .size([960, 570])
    .paddingOuter(1);

  root
    .sum((d) => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value)

  treemapLayout(root);

  const tiles = d3.select('svg')
    .selectAll('g')
    .data(root.leaves())
    .enter().append('g')
    .attr('transform', (d) => 'translate(' + [d.x0, d.y0] + ')')

  tiles
    .append('rect')
    .attr('class', 'tile')
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('fill', (d) => color(d.data.category))
    .on('mouseover', (d) => {
      tooltip.style('opacity', 1)
      tooltip.attr('data-value', d.data.value)
      tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
        .style('top', (d3.event.pageY + 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
    })
    .on('mouseout', (d) => {
      tooltip.style('opacity', 0)
    });

  tiles
    .append('text')
    .selectAll('tspan')
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('font-size', '10px')
    .style('fill', '#FFF')
    .attr('x', 1)
    .attr('y', (d, i) => 10 * (i + 1))
    .text((d) => d)

  const legend = svg.selectAll('.legend')
    .data(data.children)
    .enter()
    .append('g')
    .attr('id', 'legend')
    .attr('transform', 'translate(232, 590)');

  legend.append('text')
    .attr('x', (d, i) => i * 80 + 20)
    .attr('y', 12)
    .attr('font-size', '10px')
    .text((d) => d.name);

  legend.append('rect')
    .attr('class', 'legend-item')
    .attr('x', (d, i) => i * 80)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', (d) => color(d.name))

});