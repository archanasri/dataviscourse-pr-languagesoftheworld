loadData().then(data => {

    let that = this;



    const worldMap = new Map(data);
    const HeatMap  = new HeatMap_new(data);
    const nodeGraph = new Node(data,worldMap);

    d3.json('data/world.json').then(mapData => {
		worldMap.drawMap(mapData);
    nodeGraph.drawNodeGraph(mapData);

    });
    d3.csv('data/heatmap_features.csv').then(heatmap_feature=>{
      console.log(heatmap_feature);
      HeatMap.drawheatmap(heatmap_feature);
    })


    // This clears a selection by listening for a click
    document.addEventListener("click", function(e) {
        e.stopPropagation();
        if(e.target.tagName !="path"){
          if(e.target.tagName !="circle"){
            if(e.target.className != "slider"){
             //updateCountry(null, null);
}
        }

        }

    });
});

async function loadFile(file) {
    let data = await d3.csv(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +key;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}

async function loadData() {
    let lan = await loadFile('data/language.csv')

    return {
        'language' : lan
    };
}
