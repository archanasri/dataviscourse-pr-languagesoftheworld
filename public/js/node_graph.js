class GenderData {

    constructor(numberOfGenders, language, latitude, longitude, id, system, family, genus, macroarea) {

        this.system = system;
        this.numberOfGenders = numberOfGenders;
        this.language = language;
        this.latitude = latitude;
        this.longitude = longitude;
        this.id = id;
        this.family = family;
        this.genus = genus;
        this.macroarea = macroarea;
    }
}

class SystemData {

    constructor(system, total_languages) {
        this.system = system;
        this.total_languages = total_languages;
    }
}

class Node {

    constructor(data, worldMap, PieChart) {
        this.data = data;
        this.worldMap = worldMap;
        this.PieChart = PieChart;
    }

    drawNodeGraph() {
        var GenderBasedSystem = d3.nest()
            .key(function(d) {
                return d["31A Sex-based and Non-sex-based Gender Systems"];
            })
            .entries(this.data.language);

        let myArray = [];
        let systemArray = [];
        GenderBasedSystem.forEach(function(d) {
            let system_name = d.key;
            let total_languages = d.values.length;
            systemArray.push(new SystemData(system_name, total_languages));

            if (d.key != "") {
                var temp = d3.nest()
                    .key(function(e) {
                        return e["30A Number of Genders"]
                    })
                    .entries(d.values);

                temp.forEach(function(t) {
                    let new_temp = [];
                    let system = d.key
                    t.values.forEach(function(v) {
                        let numberOfGenders = v["30A Number of Genders"];
                        let language = v["Name"];
                        let latitude = v["latitude"];
                        let longitude = v["longitude"];
                        let id = v["wals_code"];
                        let family = v["family"];
                        let genus = v["genus"];
                        let macroarea = v["macroarea"];

                        new_temp.push(new GenderData(numberOfGenders, language, latitude, longitude, id, system, family, genus, macroarea));

                    });
                    myArray.push({
                        key: d.key,
                        values: new_temp
                    });
                })

            }

        });
        //this.worldMap.update(myArray[0]);
        this.PieChart.drawPieChart(undefined, myArray, "Gender Based Systems");
        //console.log(myArray);
        //console.log(systemArray);

        let treeArray = [];
        treeArray.push({
            "GenderSystem": "Gender Based Systems"
        });
        treeArray.push({
            "GenderSystem": "2 Sex-based",
            "parent": "Gender Based Systems"
        });
        treeArray.push({
            "GenderSystem": "1 No gender",
            "parent": "Gender Based Systems"
        });
        treeArray.push({
            "GenderSystem": "3 Non-sex-based",
            "parent": "Gender Based Systems"
        });

        myArray.forEach(function(d) {
            let parent = d.key;

            let numberOfLanguages = d.values.length;

            let GenderSystem = d.values[0].numberOfGenders;

            treeArray.push({
                "parent": parent,
                "numberOfLanguages": numberOfLanguages,
                "GenderSystem": GenderSystem
            });
        });



        //console.log(treeArray);
        let root = d3.stratify()
            .id(function(d) {
                return d.GenderSystem;
            })
            .parentId(function(d) {
                return d.parent;
            })
            (treeArray);

        root.each(function(d) {
            d.name = d.parent;
        });
        let treemap = d3.tree()
            .size([500, 500]);

        let nodes = d3.hierarchy(root, function(d) {
            return d.children;
        });

        nodes = treemap(root);

        let svg = d3.select("#tree").select("svg")
            .attr("width", 800)
            .attr("height", 600);
        let g = svg.append("g")
            .attr("transform", "translate(" + 160 + "," + 25 + ")");

        let link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter()
            .append("path")
            .attr("d", function(d) {
                return "M" + d.y + "," + d.x +
                    "C" + (d.y + d.parent.y) / 2 + "," + d.x +
                    " " + (d.y + d.parent.y) / 2 + "," + d.parent.x +
                    " " + d.parent.y + "," + d.parent.x;
            })
            .attr("stroke", "black")
            .attr("fill", "white");

        let node = g.selectAll(".node")
            .data(nodes.descendants())
            .enter()
            .append("g")
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        let color1 = d3.scaleOrdinal(d3.schemeSet1)
        //let color2 = d3.scaleOrdinal(d3.schemeOranges[4])
        let color2 = ['black','#00BFFF','#ADFF2F','#DC143C','#FFFF66','#C71585'];
        node.append("circle")
            .classed("selected", function(d) {
                if (d.id == "Gender Based Systems") {
                    return true;
                }
            })
            .attr("r", 10)
            .attr("fill", function(d) {

                if (d.parent == null || d.data.parent == "Gender Based Systems") {
                    let index = d.id.split(" ");
                    //console.log(index[0])
                    return color1(index[0]);
                } else {
                    let index = d.id.split(" ");

                    return color2[index[0]];

                }
            })
            .on("click", function(d) {
                svg.selectAll("circle").classed("selected", false);
                d3.select(this).classed("selected", true);
                let current_key = d.data.parent;
                let node_value = d.id;
                if (current_key == undefined) {
                    console.log(myArray);
                    that.PieChart.drawPieChart(current_key, myArray, node_value);
                }
                if (current_key == "Gender Based Systems") {
                    console.log(node_value)
                    let node_data = []
                    node_data.push(myArray.filter(function(o) {
                        return o.key === node_value;
                    }));

                    node_data = node_data[0];
                    var values = []
                    Object.keys(node_data).map(function(key) {
                        let d = node_data[key];
                        d.values.forEach(function(dd) {
                            return values.push(dd)
                        });
                    });
                    console.log(values)
                    let node = []
                    node.push({
                        'key': node_value,
                        "values": values
                    })
                    console.log(node[0])
                    that.worldMap.update(node[0]);
                    that.PieChart.drawPieChart(current_key, myArray, node_value);
                } else if (current_key != undefined) {


                    let recordsSorted = []
                    recordsSorted.push(myArray.filter(function(o) {
                        return o.key === current_key;
                    }));
                    recordsSorted = recordsSorted[0];
                    let recordLength = recordsSorted.length;
                    let index = 0;
                    for (let i = 0; i < recordLength; i++) {
                        let data = recordsSorted[i].values[0];
                        if (data.numberOfGenders == node_value) {
                            index = i;
                        }

                    }
                    let node_data = recordsSorted[index];
                    that.worldMap.update(node_data);
                    console.log(myArray);
                    that.PieChart.drawPieChart(current_key, myArray, node_value);
                }



            })
            .on("mouseover", function() {
                d3.select(this).classed("highlighted", true);
            })
            .on("mouseout", function() {
                d3.select(this).classed("highlighted", false)
            });


        let that = this;
        node.append("text")
            .attr("dy", "-.5em")
            .attr("x", function(d) {
                return d.children ? 8 : 13;
            })
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start";
            })
            .text(function(d) {
                if (d.data.GenderSystem != "Gender Based Systems") {
                    return d.data.GenderSystem.split(" ").splice(1, 3).toString().replace(/,/g,' ');
                } else {
                    return d.data.GenderSystem;
                }
            })
            .classed("mytext",true);




    }


}
