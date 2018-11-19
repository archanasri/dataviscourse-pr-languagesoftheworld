class heatmapData{
  constructor(feature_name,language,value,row,col){
    this.feature_name = feature_name
    this.language = language
    this.value = value
    this.row = row
    this.col = col

  }
}

class HeatMap_new{


  constructor(data,feature_encoding){
  this.data = data
  this.feature_encoding = feature_encoding;


  }


  drawheatmap(feature_encoding){

  let languageData = this.data["language"];
  let familyData = d3.nest()
              .key(function(d) {return d.family})
              .entries(languageData);

  let selected_family = "Austronesian";
  let selected_family_data = familyData.filter(function(d){return d.key==selected_family})
  selected_family_data = selected_family_data[0]
  //console.log(selected_family_data);
  let features = ["81A Order of Subject, Object and Verb","82A Order of Subject and Verb","83A Order of Object and Verb","87A Order of Adjective and Noun","89A Order of Numeral and Noun"];
  //console.log(features);
  let languages = [];
  let feature_values = [];
  selected_family_data.values.forEach((d,i)=>{
    languages.push(d.Name);
    let row = i;
    let A81 = d["81A Order of Subject, Object and Verb"].split(" ");
    if(A81 !=""){
    A81 = parseInt(A81[0])
    }
    else{
      A81 = 0
    }
    feature_values.push(new heatmapData("A81",d.Name,A81,row,0));
    let A82 = d["82A Order of Subject and Verb"].split(" ");
    if(A82 !=""){
    A82 = parseInt(A82[0])
    }
    else{
      A82 = 0
    }
    feature_values.push(new heatmapData("A82",d.Name,A82,row,1));
    let A83 = d["83A Order of Object and Verb"].split(" ");
    if(A83 !=""){
    A83 = parseInt(A83[0])
    }
    else{
      A83 = 0
    }
    feature_values.push(new heatmapData("A83",d.Name,A83,row,2));
    let A87 = d["87A Order of Adjective and Noun"].split(" ");
    if(A87 !=""){
    A87 = parseInt(A87[0])
    }
    else{
      A87 = 0
    }
    feature_values.push(new heatmapData("A87",d.Name,A87,row,3));
    let A89 = d["89A Order of Numeral and Noun"].split(" ");
    if(A89 !=""){
    A89 = parseInt(A89[0])
    }
    else{
      A89 = 0
    }
    feature_values.push(new heatmapData("A89",d.Name,A89,row,4));

  });

  //let color = d3.scaleOrdinal(d3.schemeCategory10);
  let color = d3.scaleOrdinal(d3.schemeReds[9]);
  let svg = d3.select("#heatmap").append("svg");
  let rects = svg.selectAll("rect").data(feature_values);

  rects = rects.enter().append("rect")
               .attr("x", function(d) {return d.row*30 + 20})
               .attr("y", function(d) {
                 return (d.col)*30 + 20
               })
               .attr("width",20)
               .attr("height",20)
               .attr("fill",function(d){return color(d.value)});









  }
}
