var wordcloud_id='';
var wordcloud_width=0;
var wordcloud_heigt=0;
var init = function(words,width,height,id) {
	wordcloud_id		= id;			// Not so elegant...
	wordcloud_width 	= width;		// Not so elegant...
	wordcloud_height	= height;		// Not so elegant...
	
	d3.layout.cloud().size([width, height])
		  .words(words)
		  .padding(5)
		  .rotate(function() { return ~~(Math.random() * 2) * 90; })
		  .fontSize(function(d) { return d.size; })
		  .on("end", draw)
		  .start();
};
var draw = function(words) {
	var fill = d3.scale.category20(),
		svg = d3.select("#"+wordcloud_id).append("svg")
				.attr("width", wordcloud_width)
				.attr("height", wordcloud_height)
				.append("g")
				.attr("transform", "translate(" + wordcloud_width/2 + " " + wordcloud_height/2 + ")");
    svg.selectAll("text")
			.data(words)
				.enter().append("text")
					.style("font-size", function(d) { return d.size*10 + "px"; })
					.style("fill", function(d, i) { return fill(i); })
					.attr("text-anchor", "middle")
 					.attr("transform", function(d) {
						return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
					}) 
					.text(function(d) { return d.text; });
};

define( ["jquery","./d3.min","./d3.layout.cloud"], function ( $ ) {
	'use strict';
	return {
		initialProperties: {
			version: 1.0,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 2,
					qHeight: 50
				}]
			}
		},
		//property panel
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				}
			}
		},
		snapshot: {
			canTakeSnapshot: true
		},
		paint: function ( $element, layout ) {
			if ( layout.qHyperCube.qDimensionInfo && layout.qHyperCube.qDimensionInfo.length > 0 ) {
				var id = "wordcloud_" + layout.qInfo.qId,
					words = layout.qHyperCube.qDataPages[0].qMatrix.map (function ( row ) {
						return {  
							text : row[0].qText, 	
							size : row[1].qText 
						};
					});
				if (document.getElementById(id)) {
					$("#" + id).empty();
				}
				else {
					$element.append($('<div />;')
						.attr("id", id)
						.width($element.width())
						.height($element.height())
						.html(JSON.stringify(d3.layout.cloud))
					);
				} 
				init(words,$element.width(),$element.height(),id);
			}
		}
	};

} );
