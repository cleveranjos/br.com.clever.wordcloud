/* eslint-disable max-len */
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
/* eslint-enable max-len */

import './styles.less';
import paint from './paint';
import '@babel/polyfill';

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
  data:{
    dimensions: {
      min: 1,
      max: 1
    },
    measures: {
      min: 1,
      max: 1
    },
  },
  definition: {
    type: "items",
    component: "accordion",
    items: {
      data:{
        uses: "data",
        items:{
          dimensions:{
            disabledRef: ""
          },
          measures: {
            disabledRef: ""
          }
        }
      },
      sorting: {
        uses: "sorting"
      },
      settings: {
        uses: "settings",
        items:{
          design:{
            label: "Design",
            type: "items",
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
                label: "Scale Color",
                ref: "ScaleColor",
                type: "string",
                component: "item-selection-list",
                defaultValue: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
                items: [
                  {
                    label: 'Sequential',
                    component: "color-scale",
                    value: "#ffffe5, #fff7bc, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #993404, #662506",
                    colors: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]
                  },
                  {
                    label: "Qlik Sense Diverging",
                    component: "color-scale",
                    value: "#3C52A1, #3A82C4, #69ACDE, #9FD0F1, #CFEAFA, #EEDCC5, #F4AA73, #E67A56, #CD473E, #AE1C3E",
                    colors: ["#3C52A1", "#3A82C4", "#69ACDE", "#9FD0F1", "#CFEAFA", "#EEDCC5", "#F4AA73", "#E67A56", "#CD473E", "#AE1C3E"]
                  },
                  {
                    label: "Diverging RdYlBu",
                    component: "color-scale",
                    value: "#d73027, #f46d43, #fdae61, #fee090, #ffffbf, #e0f3f8, #abd9e9, #74add1, #4575b4",
                    colors: ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"]
                  },
                  {
                    label: "Diverging BuYlRd 5 values",
                    component: "color-scale",
                    value: "#d73027, #fdae61, #ffffbf, #abd9e9, #4575b4",
                    colors: ["#d73027", "#fdae61", "#ffffbf", "#abd9e9", "#4575b4"]
                  },
                  {
                    label: "Blues",
                    component: "color-scale",
                    value: "#f7fbff, #deebf7, #c6dbef, #9ecae1, #6baed6, #4292c6, #2171b5, #08519c, #08306b",
                    colors: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
                  },
                  {
                    label: "Reds",
                    component: "color-scale",
                    value: "#fff5f0, #fee0d2, #fcbba1, #fc9272, #fb6a4a, #ef3b2c, #cb181d, #a50f15, #67000d",
                    colors: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]
                  },
                  {
                    label: "YlGnBu",
                    component: "color-scale",
                    value: "#ffffd9, #edf8b1, #c7e9b4, #7fcdbb, #41b6c4, #1d91c0, #225ea8, #253494, #081d58",
                    colors: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58",]
                  }
                ]
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
                type: "object",
                label: "From",
                component: "color-picker",
                dualOutput: true,
                defaultValue: {
                  index: -1,
                  color: "#4477aa"
                },
                ref: "colorFrom",
                show: function (data) {
                  if (data.customRange) {
                    return true;
                  }
                }
              },
              customRangeTo: {
                type: "object",
                label: "To",
                component: "color-picker",
                dualOutput: true,
                defaultValue: {
                  index: -1,
                  color: "#ffcf02"
                },
                ref: "colorTo",
                show: function (data) {
                  if (data.customRange) {
                    return true;
                  }
                }
              },
            }
          }
        }
      }
    }
  },
  snapshot: {
    canTakeSnapshot: true
  },
  clearSelectedValues(a){
    a.find(".selected")[0].classList.replace("selected","selectable"); //to make it "look" faster
    this.$scope.selectionsApi.cancel();
  },
  support: {
    export: true
  },
  paint
};
