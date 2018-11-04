/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

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
        // ******* TODO: PART I *******
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
        console.log(this.languageData);
        console.log(this.nameArray);
        let geojson = topojson.feature(world, world.objects.countries);

        let countryData = geojson.features.map(country => {

            let index = this.nameArray.indexOf(country.id);
            let region = 'countries';

            if (index > -1) {
                //  console.log(this.populationData[index].geo, country.id);
                //region = this.populationData[index].region;
                //return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            } else {
                // console.log('not found');
                //return new CountryData(country.type, country.id, country.properties, country.geometry, 'countries');
            }

        });

        // console.log(countryData);
        let path = d3.geoPath().projection(this.projection);
        let world_map = d3.select("#map-chart");
        let svg = world_map.append("svg");

        let world_map_paths = svg.selectAll("path")
           //.data(countryData)
           .enter()
           .append("path")
           .attr("d",path)
           .attr("class",function(d){return d.region})
           .attr("id",function(d){return d.id});

        let graticule = d3.geoGraticule();
       	svg.append("path")
       		 .datum(graticule)
           .attr("class", "graticule")
           .attr("d", path);


       	svg.append("path")
            .datum(graticule.outline)
            .attr("d", path)
       		  .attr("class","stroke");

       let that = this;
       world_map_paths.on("click", function(d){
           console.log(d.id);
           return that.updateCountry(d.id);
           });


    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //
        //TODO - Your code goes here -
        this.clearHighlight();

        let pathRegionSelection = undefined;
        pathRegionSelection= d3.select("#"+activeCountry);
        pathRegionSelection.classed("selected-country",true);




    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - Your code goes here -

        let map = d3.select('#map-chart').selectAll("path").classed('selected-country',false);
        console.log("test");


    }
}
