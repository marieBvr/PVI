d3.json("data/MOESM3_merge.json").then(function(input) {	

	d3.json("data/MOESM1_merge2.json").then(function(data) {
            network = {};
            network.links = data.links.concat(input.links);
            network.nodes = data.nodes.concat(input.nodes);

            var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height");

	    var simulation = d3.forceSimulation()
	    	.nodes(network.nodes)
		    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(50))
			.force('charge', d3.forceManyBody()
			  	.strength(-400)
			  	.theta(0.8)
	  	// .distanceMax(150)
	    	)
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
	            	.on('mouseout', fade(1))
	            	.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

                     var node = g.append("g")
		        .attr("class", "nodes")
				.selectAll("g")
		        .data(graph.nodes)
				.enter()
			      .append("g")
			      .attr("class", "pie")
			      .on('mouseover', fade(0.1))
				  .on('mouseout', fade(1))
			      .call(d3.drag()
			          .on("start", dragstarted)
			          .on("drag", dragged)
			          .on("end", dragended));

		/* Draw the respective pie chart for each node */
	        node.each(function (d) {
	            NodePieBuilder.drawNodePie(d3.select(this), d.sp, {
	                outerStrokeWidth: 1,
	                showLabelText: false
	            });
	        });

	        drawLegend(colorClass, "sp");

		var label = g.append("g")
		  .attr("class", "labels")
		  .selectAll("text")
			  .data(graph.nodes)
			  .enter().append("text")
			    .attr("class", "label")
			    .attr("dx", 0)
			    .attr("dy", ".35em")
			    .attr("text-anchor", "middle")
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

				d3.selectAll("circle").attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                    label
			.attr("x", function(d) { return d.x; })
		        .attr("y", function (d) { return d.y; })
		        .style("font-size", "12px").style("fill", "#000");
		}
			
		const linkedByIndex = {};
		graph.links.forEach(d => {
			linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
		});

		function isConnected(a, b) {
			return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
		}

		function fade(opacity) {
		    return d => {
			    node.style('stroke-opacity', function (o) {
			      const thisOpacity = isConnected(d, o) ? 1 : opacity;
			      this.setAttribute('fill-opacity', thisOpacity);
			      return thisOpacity;
			    });
                            link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
                    };
		};
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
		  $( ".form-control" )[0].setAttribute('disabled', true)
		  d.fx = d3.event.x
		  d.fy = d3.event.y
		  if (!d3.event.active) simulation.alphaTarget(0);
		  setTimeout(function(){
			  simulation.stop();
			  $( ".form-control" ).prop( "disabled", false );
		  }, 6000);
		}

		run(network);

		$( ".form-control" )[0].setAttribute('disabled', true)
		setTimeout(function(){
			simulation.stop();
			$( ".form-control" ).prop( "disabled", false );
		}, 6000);


		$( ".form-control" ).change(function() {
		  	//console.log(this.value);
		  	if (this.value == "pt"){
                            var node = d3.selectAll(".nodes g")
			       .data(network.nodes);
                            /* Draw the respective pie chart for each node */
		            node.each(function (d) {
		            var circle = d3.select(this).selectAll("circle");
		            NodePieBuilder.drawNodePie(d3.select(this), d.group, {
		                outerStrokeWidth: 1,
		                showLabelText: false
		            });
		            // Set pie position
		            d3.selectAll("circle").attr("cx", function (d) {
                                return d.x;
                            })
                            .attr("cy", function (d) {
                                return d.y;
                            });
                            // Remove old circle
		            circle.remove();					
		          });
                          svg.selectAll("g.legend").remove();
                          drawLegend(colorClass, "pt");
		  	}
		  	if (this.value == "sp"){
		  		var node = d3.selectAll(".nodes g")
			        .data(network.nodes);
				/* Draw the respective pie chart for each node */
		        node.each(function (d) {
		            var circle = d3.select(this).selectAll("circle");
		            NodePieBuilder.drawNodePie(d3.select(this), d.sp, {
		                outerStrokeWidth: 1,
		                showLabelText: false
		            });
		            // Set pie position
		            d3.selectAll("circle").attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
                    // Remove old circle
		    circle.remove();
		});
                svg.selectAll("g.legend").remove();
                drawLegend(colorClass, "sp");
             }
         });
     });
});


var colorClass = [];
colorClass['CIYVV'] = "#CDA458";
colorClass['PPV'] = "#455059";
colorClass['PRSV-P'] = "#F2D0A7";
colorClass['PSbMV'] = "#BFA380";
colorClass['PVA'] = "#BF7256";
colorClass['SMV-G7H'] = "#71BFAE";
colorClass['SMV-P'] = "#8F71BF";
colorClass['SYSV-O'] = "#C1F4CC";
colorClass['Arabidopsis'] = "#59DB9F";
colorClass['Viral'] = "#4393c3";
colorClass['Host'] = "#B2721A";

function chooseColor(item, color=colorClass){
	//var color = colorClass;
	return color[item];
}

var DEFAULT_OPTIONS = {
    radius: 20,
    outerStrokeWidth: 1,
    parentNodeColor: 'transparent',
    showPieChartBorder: true,
    pieChartBorderColor: 'white',
    pieChartBorderWidth: '2',
    showLabelText: false,
    labelText: 'text',
    legend: true,
    labelColor: 'blue'
};

function getOptionOrDefault(key, options, defaultOptions) {
    defaultOptions = defaultOptions || DEFAULT_OPTIONS;
    if (options && key in options) {
        return options[key];
    }
    return defaultOptions[key];
}

function drawParentCircle(nodeElement, options) {
    var outerStrokeWidth = getOptionOrDefault('outerStrokeWidth', options);
    var radius = getOptionOrDefault('radius', options);
    var parentNodeColor = getOptionOrDefault('parentNodeColor', options);

    nodeElement.insert("circle")
        .attr("id", "parent-pie")
        .attr("r", radius)
        .attr("fill", function (d) {
            return parentNodeColor;
        })
        .attr("stroke", function (d) {
            return parentNodeColor;
        })
        .attr("stroke-width", outerStrokeWidth);
}

function drawPieChartBorder(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var pieChartBorderColor = getOptionOrDefault('pieChartBorderColor', options);
    var pieChartBorderWidth = getOptionOrDefault('pieChartBorderWidth', options);

    nodeElement.insert("circle")
        .attr("r", radius)
        .attr("fill", 'transparent')
        .attr("stroke", pieChartBorderColor)
        .attr("stroke-width", pieChartBorderWidth);
}

function drawPieChart(nodeElement, percentages, options) {
    var radius = getOptionOrDefault('radius', options);
    var halfRadius = radius / 2;
    var halfCircumference = 2 * Math.PI * halfRadius;
    var percentToDraw = 0;
    for (var p in percentages) {
        percentToDraw += 100 / percentages.length;
        nodeElement.insert('circle', '#parent-pie + *')
            .attr("r", halfRadius)
            .attr("fill", 'transparent')
            .attr("id", "children-pie")
            .style('stroke', chooseColor(percentages[p]))
            .style('stroke-width', radius)
            .style('stroke-dasharray',
                    halfCircumference * percentToDraw / 100
                    + ' '
                    + halfCircumference);
    }
}

function drawTitleText(nodeElement, options) {
    var radius = getOptionOrDefault('radius', options);
    var text = getOptionOrDefault('labelText', options);
    var color = getOptionOrDefault('labelColor', options);

    nodeElement.append("text")
        .text(String(text))
        .attr("fill", color)
        .attr("dy", radius * 2);
}

var NodePieBuilder = {
    drawNodePie: function (nodeElement, percentages, options) {
        drawParentCircle(nodeElement, options);
        console.log("draw");

        if (!percentages) return;
        drawPieChart(nodeElement, percentages, options);

        var showPieChartBorder = getOptionOrDefault('showPieChartBorder', options);
        if (showPieChartBorder) {
            drawPieChartBorder(nodeElement, options);
        }

        var showLabelText = getOptionOrDefault('showLabelText', options);
        if (showLabelText) {
            drawTitleText(nodeElement, options);
        }

    }
};

function drawLegend(colors, type){
    console.log("Legende");
    var legend = d3.select("svg").append("g")
	  .attr("class", "legend")
	  .attr("x", d3.select("svg").attr("width") - 85)
	  .attr("y", 25)
	  .attr("height", 100)
	  .attr("width", 100);
	var i = 0
	for (var c in colors) {
            if (type == "sp"){
               if (c != "Viral" && c != "Host"){
	          i = i + 20
	          legend
	            .append('rect')
                    .attr("x", d3.select("svg").attr("width") - 105)
                    .attr("y", i)
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("fill",chooseColor(c, colors));
                  legend
                    .append("text")
                    .attr("x", d3.select("svg").attr("width") - 82)
                    .attr("y", i +15 )
                    .text(c);
               }
           }else{
               if (c == "Viral" || c == "Host"){
                  i = i + 20
                  legend
                     .append('rect')
                     .attr("x", d3.select("svg").attr("width") - 105)
                     .attr("y", i)
                     .attr("width", 20)
                     .attr("height", 20)
                     .attr("fill",chooseColor(c, colors));
                  legend
	             .append("text")
                     .attr("x", d3.select("svg").attr("width") - 82)
	             .attr("y", i +15 )
		     .text(c);
               }
          }
     }  
};

