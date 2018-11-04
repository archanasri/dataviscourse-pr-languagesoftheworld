class GenderData {

      constructor(numberOfGenders,language,latitude,longitude,id,system){

      this.system = system;
      this.numberOfGenders = numberOfGenders;
      this.language =language;
      this.latitude = latitude;
      this.longitude = longitude;
      this.id =id;
      }
}

class SystemData {

  constructor(system,total_languages){
    this.system = system;
    this.total_languages = total_languages;
  }
}

class Node{

    constructor(data){
    this.data = data;
    }

    drawNodeGraph(){
      var GenderBasedSystem = d3.nest()
      .key(function(d){
        return d["31A Sex-based and Non-sex-based Gender Systems"];
      })
      .entries(this.data.language);

      let myArray =[];
      let systemArray = [];
      GenderBasedSystem.forEach(function(d){
        let system_name = d.key;
        let total_languages = d.values.length;
        systemArray.push(new SystemData(system_name,total_languages));

        if(d.key != ""){
          var temp = d3.nest()
          .key(function(e){
            return e["30A Number of Genders"]
          })
          .entries(d.values);

        temp.forEach(function(t){
          let new_temp = [];
          let system = d.key
          t.values.forEach(function(v){
          let numberOfGenders = v["30A Number of Genders"];
          let language =v["Name"];
          let latitude = v["latitude"];
          let longitude = v["longitude"];
          let id =v["wals_code"];

          new_temp.push(new GenderData(numberOfGenders,language,latitude,longitude,id,system));

        });
        myArray.push({
          key: d.key,
          values: new_temp });
        })

        }

      });

      console.log(myArray);
      console.log(systemArray);

      let treeArray = [];
      treeArray.push(
        {   "GenderSystem": "Gender Based Systems"});
      treeArray.push(
        {   "GenderSystem" : "2 Sex-based",
            "parent": "Gender Based Systems"});
      treeArray.push(
        {   "GenderSystem" : "1 No gender",
            "parent": "Gender Based Systems"});
      treeArray.push(
        {   "GenderSystem" : "3 Non-sex-based",
            "parent": "Gender Based Systems"});

      myArray.forEach(function(d){
      let parent = d.key;

      let numberOfLanguages = d.values.length;

      let GenderSystem = d.values[0].numberOfGenders;

      treeArray.push(
        {
          "parent" : parent,
          "numberOfLanguages": numberOfLanguages,
          "GenderSystem" : GenderSystem
        });
      });



      console.log(treeArray);
      let root = d3.stratify()
                   .id(function(d){return d.GenderSystem;})
                   .parentId(function(d){ return d.parent;})
                   (treeArray);

      root.each(function(d){
        d.name = d.parent;
      });
      let treemap = d3.tree()
                      .size([800, 300]);

      let nodes = d3.hierarchy(root, function(d) {
        return d.children;
      });

      nodes = treemap(root);

      let svg = d3.select("#tree").append("svg")
                  .attr("width", 3100)
                  .attr("height", 1100);
      let g = svg.append("g")
                 .attr("transform", "translate(" + 250 + "," + 25 + ")");

      let link = g.selectAll(".link")
                .data(nodes.descendants().slice(1))
                .enter()
                .append("path")
                .attr("d", function(d) {
                   return "M" + d.y + "," + d.x
                     + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                     + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                     + " " + d.parent.y + "," + d.parent.x;
                   })
                .attr("stroke","black");

    let node = g.selectAll(".node")
                .data(nodes.descendants())
                .enter()
                .append("g")
                .attr("transform", function(d) {
                  return "translate(" + d.y + "," + d.x + ")";
                });
    node.append("circle")
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) {
          return d.children ? -13 : 13;
            })
        .style("text-anchor", function(d) {
              return d.children ? "end" : "start"; })
        .text(function(d) { return d.data.GenderSystem; })

    }


}
