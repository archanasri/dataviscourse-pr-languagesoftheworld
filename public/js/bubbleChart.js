class bubbleChart {

  constructor(data) {
    this.data = data

    /*this.margin = {top: 10, right: 20, bottom: 20, left: 50};
    let bChart = d3.select("#bubble-chart").classed("fullview", true);

    //fetch the svg bounds
    this.svgBounds = bChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //add the svg to the div
    this.svg = bChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);*/
  }

  createBubble() {

    var fam = d3.nest()
                .key(function(d) {return d.family})
                .entries(this.data.language);

    var modified_fam = [];
    fam.forEach(function(element) {
      if (element.values.length >= 20) {
        modified_fam.push([element.key, element.values.length]);
      }
    });

    modified_fam.sort(function(a, b) {
      return b[1] - a[1];
    });

    var newArray = [];
    modified_fam.forEach(function(element) {
      newArray.push({
        key: element[0],
        value: element[1]
      })
    });

    var myObject = new Object()
    myObject[0] = "children"
    myObject["children"] = newArray;

    console.log(myObject)

    let diameter = 600;
    let color = d3.scaleOrdinal(d3.schemeCategory10)
    let bubble = d3.pack(myObject)
                   .size([diameter, diameter])
                   .padding(1.5);

    let svg = d3.select("#bubble-chart")
                .append("svg")
                .classed("left_float",true)
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");

    let nodes = d3.hierarchy(myObject)
                  .sum(function(d) {
                    return d.value;
                  })

    let node = svg.selectAll(".node")
                  .data(bubble(nodes).descendants())
                  .enter()
                  .filter(function(d) {
                    return !d.children;
                  })
                  .append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                  });

    node.append("circle")
        .attr("r", function(d) {
          return d.r;
        })
        .attr("fill", function(d, i) {
          //console.log(d)
          return color(d.value);
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function (d) {
          return d.data.key;
        })
        .attr("font-size", function (d) {
          return d.r / 5;
        })
        .attr("fill", "white");

  }
}
