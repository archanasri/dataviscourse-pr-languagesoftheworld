class barChart {

  constructor(data) {
    this.data = data;

    this.tip = d3.tip().attr('class', 'd3-tip')
      .direction('s')
      .offset(function () {
        return [0, 0];
      })
  }

  tooltip_render(tooltip_data, c) {
    let text = '<h3 style='+'"'+ 'color:' + c +';"'+ 'class =' + (tooltip_data.name) + ' >' + tooltip_data.name + "</h3>";
    text += "<li> Number of Languages: " + tooltip_data.numLang + "</li>";
    text += "<li> Genus: " + tooltip_data.genus + "</li>";
    text += "<li> Macroarea: " + tooltip_data.macroarea + "</li>";
    return text;
  }

  wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 3.0, 
      y = text.attr("y"),
      dy = 0.1,
      //dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

  update(familyData, countryCode, color, val) {

    let that = this;

    this.tip.html((d) => {
      console.log(d)
      let tooltip_data = {
        "name": d.key,
        "numLang": d.value.length,
        "genus": d.value[0].genus,
        "macroarea": d.value[0].macroarea
      };
      let c = color(val)
      return this.tooltip_render(tooltip_data, c);
    });

    let cData = d3.nest()
                  .key(function(d) {return d.countrycodes;})
                  .entries(familyData);

    let newCountryData = []

    //console.log(cData)
    //console.log(countryCode)

    cData.forEach(element => {
      let dataKey = element.key;
      let dataValue = element.values;
      let newrow = countryCode.filter(function (e) {
        return e["A2 (ISO)"] == dataKey;
      })

      if (newrow.length != 0) {
        newCountryData.push({'key': newrow[0].COUNTRY, 'value': dataValue, 'code': element.key})
      }
    });

    newCountryData.sort(function (a, b) {
      return b.value.length - a.value.length;
    });

    //console.log(newCountryData)

    let widthScale = d3.scaleLinear()
                       .range([0, 500])
                       .domain([0, newCountryData[0].value.length])

    let yScale = d3.scaleLinear()
                   .range([50, 50 + newCountryData.length * 20 + 50])
                   .domain([0, newCountryData.length])
    
    let textScale = d3.scaleLinear()
                      .range([0, 50 + newCountryData.length * 20 + 20])
                      .domain([0, newCountryData.length])

    let svg = d3.select("#bar-chart");
    svg.selectAll("rect").remove();

    let text = d3.select(".bar")
    text = text.select("#barText").selectAll("text").data([1]);
    text = text.enter().append("text");
    text.text("Number of languages spoken in countries")
      .attr("x", 165)
      .attr("y", 50)
      .attr("class", "piechartTitle")
    text.exit().remove()

    let rectBar = d3.select("#bar-chart").selectAll("rect").data(newCountryData);
    rectBar.exit().remove();

    rectBar = rectBar.enter()
           .append("rect")
           //.transition()
           //.delay(300)
           //.duration(1000)
           .attr("x", 50)
           .attr("y", function(d, i) {
            //return yScale(i);
            return (i*40+20)
            //return (i * 20 + 40)
           })
           .attr("width", function(d) {
            return widthScale(d.value.length);
           })
           .attr("height", 20)
           .attr("fill", color(val))
           //.attr("stroke", "black")
           //.attr("stroke-width", 2.0)
           .classed("rectbar", true);

    rectBar.transition().delay(1000).duration(1000);
    
    rectBar.on("mouseover", this.tip.show)
              //function (d) {
              //d3.select("#bar-chart").selectAll("rect").classed("selected_rect", false);
              //d3.select(this).classed("selected_rect", true);
              //that.tip.show;
              //})
           .on("mouseout", this.tip.hide)
     
    //svg.append("g")
      //.attr("transform", "translate(0," + 450 + ")")
      //.call(d3.axisBottom(widthScale));

    /*svg.append("g")
      .attr("transform", "translate(0," + 100 + ")")
      .call(d3.axisLeft(yScale));*/

    d3.select("#bar-chart").call(this.tip);

    rectBar.exit().remove();

    let svg1 = d3.select("#bar-chart");
    svg1.selectAll("text").remove();

    let rectText = d3.select("#bar-chart").selectAll("text").data(newCountryData);
    /*let rectText = d3.select("#rect-text")
    .attr("width", 100)
    .attr("height", 800)

    rectText = rectText.selectAll("text").data(newCountryData);*/

    rectText.exit().remove();

    rectText.enter()
            .append("text")
            .text(function(d) {
              return d.code;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
              //return yScale(i);
              return (i * 40 + 35)
            })
            .classed("mytext", true);
            //.call(this.wrap, 30);

    rectText.exit().remove();

  }

}
