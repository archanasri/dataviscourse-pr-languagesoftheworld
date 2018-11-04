class bubbleChart {

  constructor(data) {
    this.data = data

    this.margin = {top: 10, right: 20, bottom: 20, left: 50};
    let bChart = d3.select("#bubble-chart").classed("fullview", true);

    //fetch the svg bounds
    this.svgBounds = bChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //add the svg to the div
    this.svg = bChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);
  }

  createBubble() {
    var fam = d3.nest()
                .key(function(d) {return d.family})
                .entries(this.data.language);

    var modified_fam = []
    fam.forEach(function(element) {
      //console.log(element)
      if (element.values.length >= 20) {
        modified_fam.push(element)
      }
    })
    console.log(modified_fam)

    let rScale = d3.scaleLinear()
                     

    let bubbleCircles = d3.select("#bubble-chart").select("svg").selectAll("circles").data(modified_fam);

    bubbleCircles = bubbleCircles.enter()
                                 .append("circle")
                                 .merge(bubbleCircles);

    bubbleCircles.attr("r", 12)
                 .attr("cx", 50)
                 .attr("cy", 50)
                 .attr("fill", "red");

    //bubbleCircles.

  }
}
