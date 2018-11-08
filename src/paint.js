/* global d3, $ */

import d3cloud from 'd3-cloud';

var self;

d3.wordcloud = {
  Id: '',
  Width: 0,
  Height: 0,
  fill: null,
  drawStub: function (words, layout, element, scaleColor, id, width, height) {
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
      fill = d3.scale[scaleColor]();
    }
    var svg = d3.select(`#${id}`).append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "wordcloud")
      .append("g")
      .attr("transform", "translate(" + [width / 2, height / 2] + ")");
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

    //when an item is clicked, add it to the selected values and show the Sense UI for selections
    element
      .find('.selectable')
      .on('qv-activate', function () {
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
  go: function (words, layout, element) {
    const max = layout.qHyperCube.qMeasureInfo[0].qMax;
    const min = layout.qHyperCube.qMeasureInfo[0].qMin;
    const scale = d3.scale[layout.Scale]() // Communicate the desired scale type
      .domain([min, max]) // Set the scale's input domain
      .rangeRound([layout.MinSize, layout.MaxSize]); // Set the scale's output range
    const from = Math.max(-90, Math.min(90, +layout.RadStart));
    const to = Math.max(-90, Math.min(90, +layout.RadEnd));
    const scaleRotate = d3.scale
      .linear()
      .domain([0, +layout.Orientations - 1])
      .range([from, to]); // Input [0,1] convert into output [-90,90]

    d3cloud().size([this.Width, this.Height])
      .words(words)
      .padding(5)
      .timeInterval(10)
      .rotate(function () {
        return scaleRotate(Math.round(Math.random() * (+layout.Orientations - 1)));
      })
      .fontSize(function (d) { return scale(+d.value); })
      .on("end", words => this.drawStub(words, layout, element, layout.ScaleColor, this.Id, this.Width, this.Height))
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

function paint($element, layout) {
  var id = "wordcloud_" + layout.qInfo.qId;
  self = this;

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
  cloud.go(words, layout, $element);
}

export default paint;
