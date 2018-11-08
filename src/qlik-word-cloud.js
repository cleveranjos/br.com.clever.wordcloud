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

/* global define, window, d3, document, layout, $  */

import d3cloud from './d3.layout.cloud.js';
import './styles.css';

var self;
var mElement;

d3.wordcloud = {
  Id: '',
  Width: 0,
  Height: 0,
  fill: null,
  drawStub: function (words) {
    let data = words.map(function (d) {
      return {
        text: d.text,
        elemNumber: d.elemNumber,
        value: d.value,
        size: d.size,
        x: d.x,
        y: d.y,
        rotate: d.rotate
      };
    });

    let fill = null;
    if (layout.customRange) {
      fill = d3.scale.linear()
        .domain([0, words.length])
        .interpolate(d3.interpolateHcl)
        .range([layout.colorTo, layout.colorFrom]);
    } else {
      fill = d3.scale["layout.ScaleColor"]();
    }
    var svg = d3.select("#oId").append("svg")
      .attr("width", "oWidth")
      .attr("height", "oHeight")
      .attr("class", "wordcloud")
      .append("g")
      .attr("transform", "translate(" + ["oWidth" / 2, "oHeight" / 2] + ")");
    svg.selectAll("text")
      .data(data)
      .enter().append("text")
      .style("fill", function (d, i) { return fill(i); })
      .attr("class", "selectable")
      .attr("data-value", function (d) { return d.elemNumber; })
      .attr("text-anchor", "middle")
      .attr("transform", function (d) { return "translate(" + [d.x, d.y] + ") rotate(" + d.rotate + ")"; })
      .style("font-size", function (d) { return d.size + "px"; })
      .text(function (d) { return d.text; })
      .append("svg:title").text(function (d) { return d.text + ':' + d.value; });

    mElement.find('.selectable').on('qv-activate', function () { //when an item is clicked, add it to the selected values and show the Sense UI for selections
      if (this.hasAttribute("data-value")) {
        //set the class to either selected (if it wasn't already selected) or selectable (if it was already selected)
        if ($(this).attr("class").indexOf("selected") > -1) {
          var selClass = $(this).attr("class");
          $(this).attr("class", selClass.replace("selected", "selectable"));
        } else {
          $(this).attr("class", "selected");
        }
        //get the data-value and select it
        var value = parseInt(this.getAttribute("data-value"), 10),
          dim = 0;
        self.selectValues(dim, [value], true);
      }
    });
  },
  go: function (words, layout, iter) {
    Paint = iter;

    var max = layout.qHyperCube.qMeasureInfo[0].qMax,
      min = layout.qHyperCube.qMeasureInfo[0].qMin,
      scale = d3.scale[layout.Scale]() // Communicate the desired scale type
        .domain([min, max]) // Set the scale's input domain
        .rangeRound([layout.MinSize, layout.MaxSize]), // Set the scale's output range
      from = Math.max(-90, Math.min(90, +layout.RadStart)),
      to = Math.max(-90, Math.min(90, +layout.RadEnd)),
      scaleRotate = d3.scale.linear().domain([0, +layout.Orientations - 1]).range([from, to]), // Input [0,1] convert into output [-90,90]

      // The code below creates a string with input the code of the drawStub function
      // Next, the parameters are changed in the string and the string is evaluated
      drawFunction = this.drawStub.toString()
        .replace("layout.ScaleColor", layout.ScaleColor)
        .replace(/oId/g, this.Id)
        .replace(/"oWidth"/g, this.Width)
        .replace(/"oHeight"/g, this.Height)
        .replace(/layoutScaleColor/g, layout.ScaleColor);

    d3cloud().size([this.Width, this.Height])
      .words(words)
      .padding(5)
      .timeInterval(10)
      .rotate(function () {
        return scaleRotate(Math.round(Math.random() * (+layout.Orientations - 1)));
      }) //Math.random return a random number between 0 and 1
      .fontSize(function (d) { return scale(+d.value); })
      .on("end", eval('(' + drawFunction + ')'))
      .start();

    return this;
  },
  id: function (x) {
    if (!arguments.length) {
      return this.Id;
    }
    this.Id = x;
    return this;
  },
  width: function (x) {
    if (!arguments.length) {
      return this.Width;
    }
    this.Width = x;
    return this;
  },
  height: function (x) {
    if (!arguments.length) {
      return this.Height;
    }
    this.Height = x;
    return this;
  }
};

var Paint = true;
export default {
  initialProperties: {
    version: 1.0,
    qHyperCubeDef: {
      qDimensions: [],
      qMeasures: [],
      qInitialDataFetch: [{
        qWidth: 2,
        qHeight: 100
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
      addons: {
        uses: "addons",
        items: {
          Orientations: {
            ref: "Orientations",
            label: "Orientations",
            type: "number",
            defaultValue: 2,
            min: 2,
            max: 10
          },
          RadStart: {
            ref: "RadStart",
            label: "Start Angle",
            type: "number",
            defaultValue: -90,
            min: -90,
            max: 90
          },
          RadEnd: {
            ref: "RadEnd",
            label: "End Angle",
            type: "number",
            defaultValue: 90,
            min: -90,
            max: 90
          },
          MaxSize: {
            ref: "MaxSize",
            label: "Font Max Size",
            type: "integer",
            defaultValue: 100,
            min: 10,
            max: 200
          },
          MinSize: {
            ref: "MinSize",
            label: "Font Min Size",
            type: "integer",
            defaultValue: 20,
            min: 10,
            max: 200
          },
          Scale: {
            type: "string",
            component: "dropdown",
            label: "Scale",
            ref: "Scale",
            options: [{
              value: "log",
              label: "Log"
            }, {
              value: "linear",
              label: "Linear"
            }],
            defaultValue: "linear"
          },
          ScaleColor: {
            type: "string",
            component: "dropdown",
            label: "Scale Color",
            ref: "ScaleColor",
            options: [{
              value: "category10",
              label: "category10"
            }, {
              value: "category20",
              label: "category20"
            }, {
              value: "category20b",
              label: "category20b"
            }, {
              value: "category20c",
              label: "category20c"
            }],
            defaultValue: "category20"
          },
          customRange: {
            type: "boolean",
            component: "switch",
            label: "Enable Custom Range",
            ref: "customRange",
            options: [{
              value: true,
              label: "On"
            }, {
              value: false,
              label: "Off"
            }],
            defaultValue: false
          },
          customRangeFrom: {
            type: "string",
            expression: "none",
            label: "From",
            defaultValue: "#4477AA",
            ref: "colorFrom",
            show: function (data) {
              if (data.customRange) {
                return true;
              }
            }
          },
          customRangeTo: {
            type: "string",
            expression: "none",
            label: "To",
            defaultValue: "#4477AA",
            ref: "colorTo",
            show: function (data) {
              if (data.customRange) {
                return true;
              }
            }
          },
        }
      },
      settings: {
        uses: "settings"
      }
    }
  },
  snapshot: {
    canTakeSnapshot: true
  },
  support: {
    export: true
  },
  paint: function ($element, layout) {
    var id = "wordcloud_" + layout.qInfo.qId;
    self = this;
    mElement = $element;

    $('<div />').attr("id", id)
      .width($element.width())
      .height($element.height())
      .appendTo($($element).empty());

    var words = layout.qHyperCube.qDataPages[0].qMatrix.map(function (row) {
      // Map() method creates a new array with the results of calling a function on every element in this array
      return {
        text: row[0].qText,
        elemNumber: row[0].qElemNumber,
        value: row[1].qText
      };
    });
    var cloud = d3.wordcloud.id(id).width($element.width()).height($element.height());
    cloud.go(words, layout, Paint);

    Paint = false;
  }
};