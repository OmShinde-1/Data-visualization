const dscc = require('@google/dscc');
const d3 = require('d3');

function drawViz(data) {
  const width = dscc.getWidth();
  const height = dscc.getHeight();
  
  const container = document.getElementById('viz');
  container.innerHTML = '';

  // Process data
  const words = data.tables.DEFAULT.map(row => ({
    text: row['word'],
    size: Math.sqrt(+row['frequency']) * 10 // Scales word size
  }));

  // Create Word Cloud
  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words)
    .padding(5)
    .rotate(() => (Math.random() > 0.5 ? 0 : 90))
    .fontSize(d => d.size)
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("fill", "steelblue")
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
      .text(d => d.text);
  }
}

// Subscribe to data updates
dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
