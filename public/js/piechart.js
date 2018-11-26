class piechart{

  constructor(data){
  this.data=data;
  this.tip = d3.tip().attr('class', 'd3-tip')
      .direction('se')
      .offset(function() {
          return [0,0];
      })

  }

  tooltip_render(tooltip_data) {
      let text = "<h2 class ="  + (tooltip_data.system) + " >" + tooltip_data.system + "</h2>";
      text +=  "Number of Languages Language: " + tooltip_data.language;
      return text;
  }

  drawPieChart(parent,myArray,id){


    this.tip.html((d)=>{
              console.log(d.system)
              let tooltip_data = {

              "system":d.data.system,
              "language":d.data.numLangues

           };
            /* pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */
        return this.tooltip_render(tooltip_data);
            });

  if (parent=="Gender Based Systems"){

    console.log(id);
    let pieData = [];
    let node_data = []
    node_data.push(myArray.filter(function(o) {
            return o.key === id;
        }));

    node_data = node_data[0];
    //console.log(node_data)

    node_data.forEach(function(d){

      let numberOfLanguages = d.values.length;

      let system = d.values[0].numberOfGenders.split(" ").splice(1,3);

      pieData.push({"numLangues":numberOfLanguages,"system":system});

    });
    console.log(pieData);

    let pie = d3.pie()
        .value(d => d.numLangues)
        .sort(null);

    let radius = 150;
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    let color = d3.scaleOrdinal(d3.schemeSet1)
    let svg = d3.select("#piechart").select("svg");
    svg.selectAll("text").remove();
    svg.selectAll("path").remove();
    var path = svg.datum(pieData).selectAll("path")
                              .data(pie)
                              .enter().append("path")
                              .attr("fill", function(d, i) { console.log(d)
                                return color(i); })
                              .attr("d", arc)
                              //.each(function(d) { this._current = d; }) // store the initial angles
                              .attr("transform", "translate(" + 250 + "," + 250 + ")")
                              .on("mouseover",this.tip.show)
                              .on("mouseout",this.tip.hide);
    d3.select("#piechart").select("svg").call(this.tip);

    let dt = [id];
    let text = svg.selectAll("text").data(dt);
    text = text.enter().append("text");
    text.text(function(d){return d})
    .attr("x",50)
        .attr("y",50)
        //.attr("transform", "translate(" + 250 + "," + 250 + ")");;
    text.exit().remove()

  }
  if(parent == undefined){

    let GenderBasedSystem = d3.nest()
    .key(function(d){
      return d["31A Sex-based and Non-sex-based Gender Systems"];
    })
    .entries(this.data.language);
    let newArr = []
    //console.log(GenderBasedSystem);
    GenderBasedSystem.forEach(function(d){
      let system_name = d.key;
      if (system_name ==""){
        system_name = "0 Unknown";
      }
      system_name = system_name.split(" ").splice(1,3);
      let total_languages = d.values.length;
      newArr.push({"numLangues":total_languages,"system":system_name});

    });
    console.log(newArr);
    let pie = d3.pie()
        .value(d => d.numLangues)
        .sort(null);

    let radius = 150;
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    let color = d3.scaleOrdinal(d3.schemeSet1)
    let svg = d3.select("#piechart").select("svg");
    svg.selectAll("text").remove();
    svg.selectAll("path").remove();
    var path = svg.datum(newArr).selectAll("path")
                              .data(pie)
                              .enter().append("path")
                              .attr("fill", function(d, i) { return color(i); })
                              .attr("d", arc)
                              //.each(function(d) { this._current = d; }) // store the initial angles
                              .attr("transform", "translate(" + 250 + "," + 250 + ")")
                              .on("mouseover",this.tip.show)
                              .on("mouseout",this.tip.hide);
    d3.select("#piechart").select("svg").call(this.tip);
    let dt = ["Gender Based Systems"];
    let text = svg.selectAll("text").data(dt);
    text = text.enter().append("text");
    text.text(function(d){return d})
    .attr("x",50)
        .attr("y",50)
        //.attr("transform", "translate(" + 250 + "," + 250 + ")");;
    text.exit().remove()



  }

  }


}
