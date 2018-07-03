d3.json("data/MOESM1_merge2.json").then(function(data) {

	var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var simulation = d3.forceSimulation()
    	.nodes(data.nodes)
	    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(50))
		.force('charge', d3.forceManyBody()
		  	.strength(-400)
		  	.theta(0.8)
  	// .distanceMax(150)
    	)
		// .force('collide', d3.forceCollide()
  //     .radius(d => 40)
  //     .iterations(2)
  //   )
    	.force("center", d3.forceCenter(width / 2, height / 2));

	var g = svg.append("g")
    	.attr("class", "everything");

	//add zoom capabilities 
	var zoom_handler = d3.zoom()
	    .on("zoom", zoom_actions);

    zoom_handler(svg);

    //Zoom functions 
	function zoom_actions(){
	    g.attr("transform", d3.event.transform)
	}
 
	
	function run(graph) {
		graph.links.forEach(function(d){
		d.source = d.Source;    
		d.target = d.Target;
		});           

		var link = g.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            	.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

		var node = g.append("g")
	        .attr("class", "nodes")
			.selectAll("circle")
	        .data(graph.nodes)
			.enter().append("circle")
		      .attr("r", 3)
		      .call(d3.drag()
		          .on("start", dragstarted)
		          .on("drag", dragged)
		          .on("end", dragended));

		var label = g.append("g")
		  .attr("class", "labels")
		  .selectAll("text")
		  .data(graph.nodes)
		  .enter().append("text")
		    .attr("class", "label")
		    .attr("dx", 20)
		    .attr("dy", ".35em")
		    .text(function(d) { return d.id; });

		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(graph.links);

		function ticked() {
			link
			    .attr("x1", function(d) { return d.source.x; })
			    .attr("y1", function(d) { return d.source.y; })
			    .attr("x2", function(d) { return d.target.x; })
			    .attr("y2", function(d) { return d.target.y; })
	            .style("stroke", "#aaa");

			node
				.attr("r", function(d){ return d.interaction*2 })
				// .attr("r", 5)
				.style("fill", "#4393c3")
				.style("stroke", "#fff")
				.style("stroke-width", "1px")
				.attr("cx", function (d) { return d.x; })
				.attr("cy", function(d) { return d.y; });

			label
				.attr("x", function(d) { return d.x; })
		        .attr("y", function (d) { return d.y; })
		        .style("font-size", "12px").style("fill", "#000");
		}
	}

	function dragstarted(d) {
	  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  	  d.fx = d.x
	  d.fy = d.y
	  // simulation.fix(d);
	}

	function dragged(d) {
	  d.fx = d3.event.x
	  d.fy = d3.event.y
	}

	function dragended(d) {
	  d.fx = d3.event.x
	  d.fy = d3.event.y
	  if (!d3.event.active) simulation.alphaTarget(0);
	}

	run(data);
});
