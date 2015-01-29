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
define(["jquery", "./d3.min", "./d3.layout.cloud"], function ($) {
	d3.wordcloud = function () {
		var id = '',width = 0,height = 0;
		wordcloud = function (words,layout) {
			fill = d3.scale[layout.ScaleColor]();
			var max = layout.qHyperCube.qMeasureInfo[0].qMax,//words[0].value,
				min = layout.qHyperCube.qMeasureInfo[0].qMin,// words.slice(-1)[0].value,
				scale = d3.scale[layout.Scale]()
							.domain([min, max])
							.rangeRound([layout.MinSize, layout.MaxSize]), // Min size, max size
				from = Math.max(-90, Math.min(90, +layout.RadStart)),
				to = Math.max(-90, Math.min(90, +layout.RadEnd)),
				scaleRotate = d3.scale.linear().domain([0, +layout.Orientations - 1]).range([from, to]);
								
			d3.layout.cloud().size([width, height])
				.words(words)
				.padding(5)
				.timeInterval(10)
				.rotate(function (d,i) { return scaleRotate(i) })
				.fontSize(function (d) { return scale(+d.value); })
				.on("end", draw)
				.start();
			return wordcloud;
		};
		draw = function (words) {
			var svg = d3.select("#" + id).append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("class", "wordcloud")
					.append("g")
					.attr("transform", "translate(" + [width >> 1, height >> 1] + ")");
			svg.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("fill", function (d, i) { return fill(i); })
				.attr("text-anchor", "middle")
				.attr("transform", function (d) { return "translate(" + [d.x, d.y] + ") rotate(" + d.rotate + ")";})
				.style("font-size", function (d) {	return d.size + "px"; })
				.text(function (d) { return d.text; })
				.append("svg:title").text(function (d) {return d.text + ':' + d.value; });
			return wordcloud;
		}
		wordcloud.id = function (x) {
			if (!arguments.length)
				return id;
			id = x;
			return wordcloud;
		};
		wordcloud.width = function (x) {
			if (!arguments.length)
				return width;
			width = x;
			return wordcloud;
		};
		wordcloud.height = function (x) {
			if (!arguments.length)
				return height;
			height = x;
			return wordcloud;
		};
		return wordcloud;
	};
});
