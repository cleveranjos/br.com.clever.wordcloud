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
/*global define , window, Qv, jQuery, d3, $, document  */

define(["jquery", "./d3.min", "./d3.layout.cloud"], function ($, d3) {
    d3.wordcloud = {
        Id : '',
        Width : 0,
        Height : 0,
        fill : null,
		drawStub : function (words) {
			var fill = d3.scale["layout.ScaleColor"](),				
				svg = d3.select("#oId").append("svg")
					.attr("width", "oWidth")
					.attr("height", "oHeight")
					.attr("class", "wordcloud")
					.append("g")
					.attr("transform", "translate(" + ["oWidth" / 2, "oHeight" / 2] + ")");
				svg.selectAll("text")
					.data(words)
					.enter().append("text")
					.style("fill", function (d, i) { return fill(i); })
					.attr("text-anchor", "middle")
					.on("click", function(d, i) {
					     Qv.selectValues(0,[parseInt(d.elem)],true)
					})
					.attr("transform", function (d) { return "translate(" + [d.x, d.y] + ") rotate(" + d.rotate + ")"; })
					.style("font-size", function (d) { return d.size + "px"; })
					.text(function (d) { return d.text;})
					.append("svg:title").text(function (d) { return d.text + ':' + d.value; });
		},  
        go : function (words, layout, Qv) {
            this.Qv = Qv;
            var max = layout.qHyperCube.qMeasureInfo[0].qMax,
                min = layout.qHyperCube.qMeasureInfo[0].qMin,
                scale = d3.scale[layout.Scale]()
                        .domain([min, max])
                        .rangeRound([layout.MinSize, layout.MaxSize]), // Min size, max size
                from = Math.max(-90, Math.min(90, +layout.RadStart)),
                to = Math.max(-90, Math.min(90, +layout.RadEnd)),
                scaleRotate = d3.scale.linear().domain([0, +layout.Orientations - 1]).range([from, to]),
                drawFunction = this.drawStub.toString() // bad way of keeping value of "this" when callingback from "d3"
								.replace("layout.ScaleColor", layout.ScaleColor)
								.replace(/oId/g, this.Id)
								.replace(/"oWidth"/g, this.Width)
								.replace(/"oHeight"/g, this.Height)
								.replace(/layoutScaleColor/g, layout.ScaleColor);
            d3.layout.cloud().size([this.Width, this.Height])
                .words(words)
                .padding(5)
                .timeInterval(10)
                .rotate(function() { return scaleRotate(Math.round(Math.random() * (+layout.Orientations - 1))); })
                .fontSize(function (d) { return scale(+d.value); })
                .on("end", eval ('(' + drawFunction + ')'))
				.start();
            return this;
        },
        id : function (x) {
            if (!arguments.length) {
                return this.Id;
            }
            this.Id = x;
            return this;
        },
        width : function (x) {
            if (!arguments.length) {
                return this.Width;
            }
            this.Width = x;
            return this;
        },
        height : function (x) {
            if (!arguments.length) {
                return this.Height;
            }
            this.Height = x;
            return this;
        }
    };
});
