/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data) {

        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        this.nameArray = data.language.map(d => d.wals_code.toUpperCase());
        this.languageData = data.language;
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
           .attr("d",p);

        let graticule = d3.geoGraticule();
       	svg.append("path")
       	   .datum(graticule)
           .attr("d", p)
           .attr("class", "graticule")
           //.attr("stroke","red")
           //.attr("fill","blue");

       	svg.append("path")
            .datum(graticule.outline)
            .attr("fill","none")
            .attr("d", p)
            .attr("stroke","black");
    }

    update(node_data){
      //console.log(node_data);
      let world_map = d3.select("#map").select("svg")
      let svg = world_map;
      let that = this;
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
        .attr("class",function(d){
          let system = d.system;
          system = system.split(" ");
          //console.log(system[1]);
          return system[1];
        })
    }

    update_bubble(familyData, color, value) {
        //console.log(familyData);
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
}
