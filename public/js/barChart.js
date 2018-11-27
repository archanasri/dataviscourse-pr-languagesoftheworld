class barChart {

  constructor(data) {
    this.data = data;

    this.tip = d3.tip().attr('class', 'd3-tip')
      //.direction('se')
      .offset(function () {
        return [0, 0];
      })
  }

  tooltip_render(tooltip_data) {
    let text = "<h2 class =" + (tooltip_data.name) + " >" + tooltip_data.name + "</h2>";
    text += "Number of Languages: " + tooltip_data.numLang;
    return text;
  }

  update(familyData, countryCode, color, val) {

    let that = this;

    this.tip.html((d) => {
      let tooltip_data = {
        "name": d.key,
        "numLang": d.value.length,
      };
      return this.tooltip_render(tooltip_data);
    });

    let cData = d3.nest()
                  .key(function(d) {return d.countrycodes;})
                  .entries(familyData);

    let newCountryData = []

    cData.forEach(element => {
      let dataKey = element.key;
      let dataValue = element.values;
      let newrow = countryCode.filter(function (e) {
        return e["A2 (ISO)"] == dataKey;
      })

      if (newrow.length != 0) {
        newCountryData.push({key: newrow[0].COUNTRY, value: dataValue})
      }
    });

    newCountryData.sort(function (a, b) {
      return b.value.length - a.value.length;
    });

    let widthScale = d3.scaleLinear()
                       .range([0, 760])
                       .domain([0, newCountryData.length])

    let yScale = d3.scaleLinear()
                   .range([0, 700])
                   .domain([0, newCountryData.length])

    let svg = d3.select("#bar-chart");
    svg.selectAll("rect").remove();

    let rectBar = d3.select("#bar-chart").selectAll("rect").data(newCountryData);

    rectBar.exit().remove();

    rectBar.enter()
           .append("rect")
           .attr("x", 100)
           .attr("y", function(d, i) {
               //return yScale(i)
            return (i*50+20)
           })
           .attr("width", function(d) {
               //console.log(d)
            return widthScale(d.value.length);
           })
           .attr("height", 20)
           .attr("fill", color(val))
           .on("mouseover", this.tip.show)
           .on("mouseout", this.tip.hide);

    d3.select("#bar-chart").call(this.tip);

    rectBar.exit().remove();

    let svg1 = d3.select("#bar-chart");
    svg1.selectAll("text").remove();

    let rectText = d3.select("#bar-chart").selectAll("text").data(newCountryData);

    rectText.exit().remove();

    rectText.enter()
            .append("text")
            .text(function(d) {
              return d.key;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
              return (i*50 + 40)
            });

    rectText.exit().remove();

  }

}
