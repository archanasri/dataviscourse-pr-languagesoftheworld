class bubbleChart {

  constructor(data, wordldMap, barMap) {
    
    this.data = data;
    this.wordldMap = wordldMap;
    this.barMap = barMap;
  
  }

  createBubble() {

    let that = this;

    var fam = d3.nest()
                .key(function(d) {return d.family})
                .entries(this.data.language);

    var modified_fam = [];
    fam.forEach(function(element) {
      if (element.values.length >= 50) {
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

    //console.log(myObject)

    let diameter = 550;
    let color = d3.scaleOrdinal(d3.schemeCategory10)
    let bubble = d3.pack(myObject)
                   .size([diameter, diameter])
                   .padding(0.5);

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

    let languageData = this.data.language;

    node.append("circle")
        .attr("r", function(d) {
          return d.r;
        })
        .attr("fill", function(d, i) {
          return color(d.value);
        })
        .on("click", function(d) {
          let selectedFamily = d.data.key;
          let familyData = [];
          familyData.push(languageData.filter(function (v) { return v.family == selectedFamily }));
          that.wordldMap.update_bubble(familyData[0], color, d.value);
          d3.csv("data/country_code.csv").then(countryCode => {
            that.barMap.update(familyData[0], countryCode, color, d.value);
          })
          //that.barMap.update(familyData[0]);
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
