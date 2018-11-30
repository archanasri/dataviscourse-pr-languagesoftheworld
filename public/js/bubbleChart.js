class bubbleChart {

  constructor(data, wordldMap, barMap) {

    this.data = data;
    this.wordldMap = wordldMap;
    this.barMap = barMap;

    this.tip = d3.tip().attr('class', 'd3-tip')
      .direction('se')
      .offset(function () {
        return [0, 0];
      })

  }

  tooltip_render(tooltip_data) {
    let text = "<h2 class =" + (tooltip_data.name) + " >" + tooltip_data.name + "</h2>";
    text += "Number of Languages: " + tooltip_data.numLang;
    return text;
  }

  createTransition() {
    d3.select("#bubble-chart").select("svg").select("g").selectAll("circle").transition().delay(300).duration(1000);
  }

  createBubble() {

    let that = this;

    this.tip.html((d) => {
      let tooltip_data = {
        "name": d.data.key,
        "numLang": d.data.value,
      };

      return this.tooltip_render(tooltip_data);
    });

    var fam = d3.nest()
                .key(function(d) {return d.family})
                .entries(this.data.language);

    var modified_fam = [];
    fam.forEach(function(element) {
      if (element.values.length >= 50) {
        modified_fam.push([element.key, element.values.length, element.values]);
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

    let diameter = 550;
    let color = d3.scaleOrdinal(d3.schemeCategory10)
    let bubble = d3.pack(myObject)
                   .size([diameter, diameter])
                   .padding(0.5);

    let svg = d3.select("#bubble-chart")
                .append("svg")
                .data(fam)
                .classed("left_float",true)
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble")
                //.on("mouseover", this.tip.show)
                //.on("mouseout", this.tip.hide);
    
    //d3.select("#bubble-chart").select("svg").call(this.tip);

    let nodes = d3.hierarchy(myObject)
                  .sum(function(d) {
                    return d.value;
                  })

    let node = svg.selectAll(".node")
                  //.transition()
                  //.delay(300).duration(1000)
                  .data(bubble(nodes).descendants())
                  .enter()
                  .filter(function(d) {
                    return !d.children;
                  })
                  .append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                  })
                  .on("mouseover", this.tip.show)
                  .on("mouseout", this.tip.hide);
    
    //d3.select("node").call(this.tip);
    d3.select("#bubble-chart").select("svg").call(this.tip);

    let languageData = this.data.language;

    node.append("circle")
        //.transition()
        //.delay(300).duration(1000)
        .attr("r", function(d) {
          return d.r;
        })
        .attr("fill", function(d, i) {
          return color(d.value);
        })
        .on("click", function(d) {
          //that.createTransition();
          //createTransition()
          let selectedFamily = d.data.key;
          let familyData = [];

          familyData.push(languageData.filter(function (v) { return v.family == selectedFamily }));
          that.wordldMap.update_bubble(familyData[0], color, d.value);
          d3.csv("data/country_code.csv").then(countryCode => {
            that.barMap.update(familyData[0], countryCode, color, d.value);
          })
          //that.barMap.update(familyData[0]);
        })
        //.transition();

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

    //d3.select("#bubble-chart").select("svg").select("g").selectAll("circle").transition().delay(300).duration(1000);
  }

}
