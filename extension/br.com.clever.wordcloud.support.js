/*
Copyright (c) 2015, Clever Anjos (clever@clever.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */
var wordcloud;
define(["jquery", "./d3.min", "./d3.layout.cloud"], function ($) {
	wordcloud = {
		id : '',
		width : 0,
		heigt : 0,
		init : function (words, width, height, id) {
			wordcloud.id = id;
			wordcloud.width = +width;
			wordcloud.height = +height;
			words.sort(function (a, b) { return b.value - a.value; });
			var max = words[0].value,
			min = words.slice(-1)[0].value,
			scale = d3.scale.log()
				.domain([min, max])
				.rangeRound([20, 100]); // Min size, max size
			d3.layout.cloud().size([width, height])
				.words(words)
				.padding(5)
				//.font('Impact')
				.timeInterval(10)
				.rotate(function () { return ~~(Math.random() * 3) * 60; })
				.fontSize(function (d) { return scale(+d.value); })
				.on("end", wordcloud.draw)
				.start();
		},
		draw : function (words) {
			var fill = d3.scale.category20c(),
			svg = d3.select("#" + wordcloud.id).append("svg")
				.attr("width", wordcloud.width)
				.attr("height", wordcloud.height)
				.attr("class", "wordcloud")
				.append("g")
				.attr("transform", "translate(" + [wordcloud.width >> 1, wordcloud.height >> 1] + ")");
			svg.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("fill", function (d, i) { return fill(i);})
				.attr("text-anchor", "middle")
				.attr("transform", function (d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
				.style("font-size", function (d) {	return d.size + "px"; })
				.text(function (d) { return d.text; })
				.append("svg:title").text(function (d) {return d.text + ':' + d.value				});
		}
	}
});
