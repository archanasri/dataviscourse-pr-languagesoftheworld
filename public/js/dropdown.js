class dropdownBox{

constructor(data,HeatMap){
  this.data = data;
  this.HeatMap = HeatMap
}
onchange() {
	selectValue = d3.select('select').property('value');
	d3.select('#dropdown')
		.append('p')
		.text(selectValue + ' is the last selected option.')
};

drawDropDown(){

  let svg = d3.select("#dropdown");
  let fam = d3.nest()
              .key(function(d) {return d.family})
              .entries(this.data.language);


  let select = svg.append('select')
  	.attr('class','select')
    .on('change',onchange)

  let options = select
  .selectAll('option')
	.data(fam).enter()
	.append('option')
  .attr("value", function(ds) { return d.key; })
	.text(function (d) { return d.key; });


}

}
