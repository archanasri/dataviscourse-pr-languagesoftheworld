/** Class representing the map view. */
class Map {

        constructor(data) {
        this.projection = d3.geoPatterson().scale(135).translate([500, 245]);
        //this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.language.map(d => d.wals_code.toUpperCase());
        this.languageData = data.language;

        // Intialize tool-tip
        this.tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
    };

    tooltip_render(tooltip_data) {
        let text = "<h2 class ="  + (tooltip_data.system) + " >" + tooltip_data.system + "</h2>";
        text +=  "Language: " + tooltip_data.language;
        text += "<br>Number of Genders: " + tooltip_data.numberOfGenders;
        text += "<br>Family: " + tooltip_data.family;
        text += "<br>Genus: " + tooltip_data.genus;
        text += "<br>Macro Area: " + tooltip_data.macroarea;

        return text;
    }
    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!
        //console.log(this.languageData);
        //console.log(this.nameArray);
        //console.log(world);
        let geojson = topojson.feature(world, world.objects.countries);

        let p = d3.geoPath().projection(this.projection);
        let world_map = d3.select("#map").select("svg")
        let svg = world_map;
        //.append("svg");
        let world_map_paths = svg.selectAll("path")
           .data(geojson.features);
          world_map_paths.enter()
           .append("path")
           .attr("fill","white")
           .attr("stroke","black")
           .attr("d",p)
           .attr("class","countries");

        let graticule = d3.geoGraticule();
       	/*svg.append("path")
       	   .datum(graticule)
           .attr("d", p)
           .attr("class", "graticule")*/


       	svg.append("path")
            .datum(graticule.outline)
            .attr("fill","none")
            .attr("d", p)
            .attr("stroke","black");
    }

    update(node_data){


      this.tip.html((d)=>{

                let n = d.numberOfGenders.split(" ")
              // populate data in the following format
                let tooltip_data = {
                "system":d.system.split(" ").splice(1,2),
               "numberOfGenders": n[1],
               "language":d.language,
               "family":d.family,
               "genus":d.genus,
               "macroarea":d.macroarea

             };

          return this.tooltip_render(tooltip_data);
              });

      //console.log(node_data);
      //let color = d3.scaleOrdinal(d3.schemeDark2)
      let color = ['black','#00BFFF','#ADFF2F','#DC143C','#FFFF66','#C71585']
      let world_map = d3.select("#map").select("svg")
      let svg = world_map;
      let that = this;
      svg.selectAll("circle").remove();
      let circles = svg.selectAll("circle")
        .data(node_data.values);

      circles.exit().remove();
      circles = circles.enter().append("circle")
        .attr("r", 5)
        .attr("transform", function(d) {
          return "translate(" + that.projection([
            d.longitude,
            d.latitude
            ]) + ")";
          })
        .attr("fill",function(d){
          console.log(d)
          let system = d.numberOfGenders;
          system = system.split(" ");
          console.log(system[0]);
          return color[parseInt(system[0])];
        })
        .on("mouseover",this.tip.show
        )
        .on("mouseout",this.tip.hide
        )

        .attr("fill",function(d){
          let ind = d.numberOfGenders;
          ind = ind.split(" ");
          return color[parseInt(ind[0])];
        });
        d3.select("#map").select("svg").call(this.tip);
    }

    update_bubble(familyData, color, value) {
        let world_map = d3.select("#map").select("svg")
        let svg = world_map;
        let that = this;
        svg.selectAll("circle").remove();
        let circles = svg.selectAll("circle")
            .data(familyData);

        circles.exit().remove();

        circles = circles.enter().append("circle")
            .attr("r", 3)
            .attr("transform", function (d) {

                return "translate(" + that.projection([
                    d.longitude,
                    d.latitude
                ]) + ")";
            })
            .attr("fill", color(value));
    }

    update_fromPie(parent,myArray,id){

      if (id != "Unknown"){
        if(parent !="Gender Based Systems"){
        let system_data = [];

        system_data.push(myArray.filter(function(o) {
                let new_key = o.key.split(" ");
                new_key = new_key[1];

                return new_key === parent[0];
            }));
        let circle_data = [];
        let index = 0;
        for(let i=0;i<system_data[0].length;i++){

          if(system_data[0][i].values[0].numberOfGenders.split(" ")[1] == id){
           index = i;
          }

        }
        this.update(system_data[0][index])
    }
    else{
      let system_data = [];
      let values =[];
      system_data.push(myArray.filter(function(o) {
              let new_key = o.key.split(" ");
              new_key = new_key[1];
              console.log(new_key,id[0])
              if(new_key == id[0]){
                values = values.concat(o.values);
              }
              return new_key === id[0];
          }));
      let circle_data =[];
      circle_data.push({"key":id[0],"values":values});
      this.update(circle_data[0]);



    }
  }
    }
}
