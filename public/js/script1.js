loadData().then(data => {

    let that = this;

    const bubbleMap = new bubbleChart(data);
    const worldMap = new Map(data);
    //const nodeGraph = new Node(data);

    d3.json('data/world.json').then(mapData => {
		worldMap.drawMap(mapData);
        //nodeGraph.drawNodeGraph(mapData);
        bubbleMap.createBubble(mapData);
    });

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