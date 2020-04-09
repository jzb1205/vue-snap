<template xmlns="http://www.w3.org/1999/html">
  <div id="app" class="joint-app joint-theme-modern">
    <div class="app-header">
      <div class="app-title">
        <h1 align="center">架构图</h1>
      </div>
      <div class="toolbar-container ">
        <!-- <label>Zoom</label>
                <input type="range" min="0.2" max="5" step="0.2" value="1" onchange="zoomlevel.value=this.value; paper.scale(this.value);" />
                <output id="zoomlevel">1</output>-->
        <button id="zoom-in" style="font-size: 15px;margin-left: 10px">
          放大
        </button>
        <button id="zoom-out" style="font-size: 15px;margin-left: 10px">
          缩小
        </button>
        <label
          for="ox"
          title="Position of zero x-coordinate of the paper in pixels"
          style="font-size: 15px;margin-left: 10px"
          >整体左右移动</label
        >
        <input
          id="ox"
          name="ox"
          type="range"
          value="0"
          min="-200"
          max="200"
          autocomplete="off"
        />
        <!--<output for="ox">0</output>-->
        <label
          for="oy"
          title="Position of zero y-coordinate of the paper in pixels"
          style="font-size: 15px;margin-left: 10px"
          >整体上下移动</label
        >
        <input
          id="oy"
          type="range"
          value="0"
          min="-200"
          max="200"
          autocomplete="off"
        />
        <!--<output for="oy">0</output>-->
        <button id="clearGraph" style="font-size: 15px;margin-left: 10px">
          清空
        </button>
      </div>
    </div>
    <div class="app-body">
      <div class="stencil-container" id="stencil"></div>
      <div class="paper-container" id="paper" @mousemove="updateXY"></div>
      <div class="inspector-container">
        <div class="form-horizontal" style="padding: 10px">
          <h1>编辑图形</h1>
          <h2>Text</h2>
          <div class="input-group mb-3 input-group-lg ">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              文字大小
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="文字大小"
              v-model="shapAttrs.text.fontSize"
              @change="
                changeTextFontSize(shapAttrs.cell, shapAttrs.text.fontSize)
              "
            />
          </div>
          <div class="input-group mb-3 input-group-lg ">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              文字内容
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="文字内容"
              v-model="shapAttrs.text.content"
              @change="
                changeTextContent(shapAttrs.cell, shapAttrs.text.content)
              "
            />
          </div>
          <div class="form-group input-group input-group-lg">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              文字颜色
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="文字颜色"
              v-model="shapAttrs.text.color"
              @change="changeTextColor(shapAttrs.cell, shapAttrs.text.color)"
            />
          </div>
          <h2>Shap</h2>
          <div class="input-group mb-3 input-group-lg ">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              高度
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="高度"
              v-model="shapAttrs.height"
              @change="changeHeight(shapAttrs.cell, shapAttrs.height)"
            />
          </div>
          <div class="form-group input-group input-group-lg">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              宽度
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="宽度"
              v-model="shapAttrs.width"
              @change="changeWidth(shapAttrs.cell, shapAttrs.width)"
            />
          </div>
          <div class="form-group input-group input-group-lg">
            <div style="font-size: 15px;margin-top: 10px;margin-right: 10px">
              颜色
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="颜色"
              v-model="shapAttrs.color"
              @change="changeColor(shapAttrs.cell, shapAttrs.color)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// const _ = require("lodash");
// const joint = require("jointjs");
// const backbone = require("../../static/js/backbone.js");
// import "../../static/css/joint.css";
export default {
  data() {
    return {
      x: 0,
      y: 0,
      active: true,
      graph: new joint.dia.Graph(),
      shapAttrs: {
        cell: null,
        height: 60,
        width: 60,
        color: "",
        text: {
          content: "",
          color: "",
          fontSize: "10"
        }
      },
      linkAttrs: {
        cell: null,
        text: "",
        color: ""
      }
    };
  },
  mounted: function() {
    // this.shaps()
    this.inti();
  },
  computed: {},
  created() {
    this.inti();
  },
  methods: {
    updateXY: function(event) {
      this.x = event.offsetX;
      this.y = event.offsetY;
    },
    changeTextFontSize(cell, fontSize) {
      cell.attr("label/fontSize", fontSize);
    },
    changeTextContent(cell, content) {
      cell.attr("label/text", content);
    },
    changeTextColor(cell, color) {
      cell.attr("label/fill", color);
    },
    changeHeight(cell, height) {
      cell.size(this.shapAttrs.width, height);
    },
    changeWidth(cell, width) {
      cell.size(width, this.shapAttrs.height);
    },
    changeColor(cell, color) {
      cell.attr("body/fill", color);
    },
    inti() {
      this.graph = new joint.dia.Graph();
      var paper = new joint.dia.Paper({
        el: $("#paper"),
        width: 790,
        height: 590,
        gridSize: 10,
        drawGrid: true,
        /*background: {
                            color: 'rgba(0, 255, 0, 0.3)'
                        },*/
        model: this.graph,
        defaultLink: new joint.dia.Link({
          attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } }
        }),
        elementView: joint.dia.ElementView.extend({
          //双击删除
          pointerdblclick: function(evt, x, y) {
            joint.dia.CellView.prototype.pointerdblclick.apply(this, arguments);
            this.notify("element:pointerdblclick", evt, x, y);
            this.model.remove();
          }
        }),
        linkView: joint.dia.LinkView.extend({
          //双击删除
          pointerdblclick: function(evt, x, y) {
            joint.dia.CellView.prototype.pointerdblclick.apply(this, arguments);
            this.notify("link:pointerdblclick", evt, x, y);
            this.model.remove();
          }
        }) /*,
                        validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView)=> {
                            // Prevent linking from input ports.
                            if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
                            // Prevent linking from output ports to input ports within one element.
                            if (cellViewS === cellViewT) return false;
                            // Prevent linking to input ports.
                            return magnetT && magnetT.getAttribute('port-group') === 'in';
                        },
                        validateMagnet: (cellView, magnet)=> {
                            // Note that this is the default behaviour. Just showing it here for reference.
                            // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                            return magnet.getAttribute('magnet') !== 'passive';
                        }*/
      });

      // Canvas from which you take shapes
      var stencilGraph = new joint.dia.Graph();
      var stencilPaper = new joint.dia.Paper({
        el: $("#stencil"),
        width: 790,
        height: 590,
        model: stencilGraph,
        interactive: false
      });

      var r1 = new joint.shapes.standard.Rectangle({
        position: { x: 35, y: 10 },
        size: { width: 60, height: 60 },
        attrs: {
          body: { stroke: "blue", fill: "lightblue" },
          label: { text: "方形", fontSize: 100 }
        },
        ports: {
          groups: {
            inPorts: {
              attrs: {
                text: { fill: "#000000" },
                circle: { fill: "#00ff00", stroke: "#000000", magnet: true }
              }
            },
            outPorts: {
              attrs: {
                text: { fill: "#000000" },
                circle: { fill: "#ff0000", stroke: "#000000", magnet: true }
              },
              position: {
                name: "ellipse",
                args: {
                  dx: -1,
                  dy: -1,
                  dr: 0,
                  step: 30,
                  startAngle: 90
                }
              },
              label: { position: "outside" }
            }
          },
          items: [
            {
              id: "in1",
              group: "inPorts"
              // attrs: { text: { text: 'in1' }}
            },
            {
              group: "inPorts"
              // attrs: { text: { text: 'in2' }}
            },
            {
              id: "out",
              group: "outPorts"
              // attrs: { text: { text: 'out' }}
            }
          ]
        }
      });
      var r2 = new joint.shapes.standard.Circle({
        position: { x: 145, y: 10 },
        size: { width: 60, height: 60 },
        attrs: {
          body: { stroke: "blue", fill: "lightblue" },
          label: { text: "圆形", fontSize: 100 }
        },
        portMarkup: [{ tagName: "rect", selector: "portBody" }],
        ports: {
          groups: {
            a: {
              position: {
                name: "ellipse",
                args: {
                  dx: -5,
                  dy: -5,
                  dr: 0,
                  step: 30,
                  startAngle: 90
                }
              },
              attrs: {
                portBody: {
                  width: 13,
                  height: 13,
                  stroke: "#00ff00",
                  fill: "#00ff00",
                  magnet: "active"
                }
              }
            },
            b: {
              position: {
                name: "ellipse",
                args: {
                  dx: -5,
                  dy: -5,
                  dr: 0,
                  step: 10,
                  startAngle: 270
                }
              },
              attrs: {
                portBody: {
                  width: 13,
                  height: 13,
                  stroke: "red",
                  fill: "red",
                  magnet: "active"
                }
              }
            }
          },
          items: [{ group: "a" }, { group: "b" }]
        }
      });
      stencilGraph.addCells([r1, r2]);

      stencilPaper.on("cell:pointerdown", (cellView, e, x, y) => {
        $("body").append(
          '<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>'
        );
        var flyGraph = new joint.dia.Graph(),
          flyPaper = new joint.dia.Paper({
            el: $("#flyPaper"),
            width: 100,
            height: 100,
            model: flyGraph,
            interactive: false
          }),
          flyShape = cellView.model.clone(),
          pos = cellView.model.position(),
          offset = {
            x: x - pos.x,
            y: y - pos.y
          };

        flyShape.position(0, 0);
        flyGraph.addCell(flyShape);
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        });
        $("body").on("mousemove.fly", e => {
          $("#flyPaper").offset({
            left: e.pageX - offset.x,
            top: e.pageY - offset.y
          });
        });
        $("body").on("mouseup.fly", e => {
          var x = e.pageX,
            y = e.pageY,
            target = paper.$el.offset();

          // Dropped over paper ?
          if (
            x > target.left &&
            x < target.left + paper.$el.width() &&
            y > target.top &&
            y < target.top + paper.$el.height()
          ) {
            var s = flyShape.clone();
            s.position(x - target.left - offset.x, y - target.top - offset.y);
            // s.size(10,10)
            // console.log(this.graph)
            this.graph.addCell(s);
          }
          $("body")
            .off("mousemove.fly")
            .off("mouseup.fly");
          flyShape.remove();
          $("#flyPaper").remove();
        });
      });
      // console.log(paper)
      paper.on("cell:pointerdown", (cellView, evt, x, y) => {
        // alert(JSON.stringify(window.this.shapAttrs))
        var cell = cellView.model;
        console.log(cell);
        // cell.attr('label/fontSize',20);
        // cell.attr('label/fontSize', 60);
        // var keys= Object.keys(cell);
        // console.log(keys);
        // console.log(cell.cid)
        // console.log(cell.get("size").height)
        // console.log(cell.get("size").width)
        // console.log(JSON.stringify(cell.get("attrs")))
        // // cell.get("attrs")['.label'].text="你好"
        // console.log(cell.get("attrs")['.label'].text) //文本
        // console.log(cell.get("attrs")['.label'].fill) //字体颜色
        // console.log(cell.get("attrs")['rect'].fill) //图形填充色
        // cell.attrs.label.text='basic.Rect'
        // cell.get("attrs")['label'].text=111
        // cell.get("size").height=10
        // cell.attr('label/text',"hello");
        if (cell.get("type").startsWith("standard")) {
          // cell.size(60,10)
          this.shapAttrs = {
            cell: cellView.model,
            height: cell.get("size").height,
            width: cell.get("size").width,
            color: cell.get("attrs")["body"].fill,
            text: {
              content: cell.get("attrs")["label"].text,
              color: cell.get("attrs")["label"].fill,
              fontSize: cell.get("attrs")["label"].fontSize
            }
          };
        }
        console.log(cell);
        if (cell.get("type") == "link") {
          // cell.size(60,10)
          // cell.attr('label/text',"hello");
          /*this.linkAttrs={
                            cell:cellView.model,
                            text:cell.get("attrs")['label'].text,
                            color:cell.get("attrs")['label'].fill
                        }*/
        }
        // console.log(paper)
        // alert(JSON.stringify(this.shapAttrs))
        // cell.size(10,10)
        // cell.size(this.shapAttrs.height,this.shapAttrs.width)
      });
      // First, unembed the cell that has just been grabbed by the user.
      paper.on("cell:pointerdown", (cellView, evt, x, y) => {
        var cell = cellView.model;

        if (!cell.get("embeds") || cell.get("embeds").length === 0) {
          // Show the dragged element above all the other cells (except when the
          // element is a parent).
          cell.toFront();
        }

        if (cell.get("parent")) {
          this.graph.getCell(cell.get("parent")).unembed(cell);
        }
      });

      paper.on("cell:pointerdown", (cellView, evt, x, y) => {
        var cell = cellView.model;
        // alert(JSON.stringify(cell.get("position").x))
        if (cell.get("type").startsWith("standard")) {
          var disH = cell.get("size").height;
          var disW = cell.get("size").width;

          var centerbefore = cell.getBBox().center();
          var labelbefore = centerbefore.toString();
          var xybefore = labelbefore.split("@");

          // cell.get("position").x+width
          console.log(
            "postion x==" +
              cell.get("position").x +
              "==vue x" +
              this.x +
              "=====" +
              disW +
              "==" +
              (cell.get("position").x + disW * 0.8)
          );
          console.log(
            "postion y==" +
              cell.get("position").y +
              "==vue y" +
              this.y +
              "=====" +
              disH +
              "==" +
              (cell.get("position").y + disH * 0.8)
          );
          if (
            this.x >= cell.get("position").x + disW * 0.6 &&
            this.y >= cell.get("position").y + disH * 0.6
          ) {
            document.onmousemove = ev => {
              var centerafter = cell.getBBox().center();
              var labelafter = centerafter.toString();
              var xyafter = labelafter.split("@");
              var ev = ev || window.event;
              //拖拽时为了对宽和高 限制一下范围，定义两个变量
              var W = xyafter[0] - xybefore[0] + disW;
              var H = xyafter[1] - xybefore[1] + disH;

              cell.size(W, H);
            };
            document.onmouseup = function() {
              document.onmousemove = null;
              document.onmouseup = null;
            };
          }
        }
      });
      /*paper.on('cell:pointermove', (cellView, evt, x, y)=> {
                    var cell = cellView.model;
                    // cell.size(cell.get("size").width+2,cell.get("size").height+2)
                    // alert(cell.get('position'))
                    // console.l(x+"=="+y)
                });*/
      // When the dragged cell is dropped over another cell, let it become a child of the
      // element below.
      paper.on("cell:pointerup", (cellView, evt, x, y) => {
        var cell = cellView.model;
        var cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());

        if (cellViewsBelow.length) {
          // Note that the findViewsFromPoint() returns the view for the `cell` itself.
          var cellViewBelow = _.find(cellViewsBelow, function(c) {
            return c.model.id !== cell.id;
          });

          // Prevent recursive embedding.
          if (cellViewBelow && cellViewBelow.model.get("parent") !== cell.id) {
            cellViewBelow.model.embed(cell);
          }
        }
      });

      //放大缩小
      var zoomLevel = 1;
      $("#zoom-in").on("click", function() {
        zoomLevel = Math.min(3, zoomLevel + 0.2);
        var size = paper.getComputedSize();
        paper.translate(0, 0);
        paper.scale(zoomLevel, zoomLevel, size.width / 2, size.height / 2);
      });

      $("#zoom-out").on("click", function() {
        zoomLevel = Math.max(0.2, zoomLevel - 0.2);
        var size = paper.getComputedSize();
        paper.translate(0, 0);
        paper.scale(zoomLevel, zoomLevel, size.width / 2, size.height / 2);
      });
      $("#clearGraph").on("click", () => {
        this.graph.clear();
      });

      var $ox = $("#ox");
      var $oy = $("#oy");
      $ox.on("input change", function() {
        paper.setOrigin(parseInt(this.value, 10), parseInt($oy.val(), 10));
      });
      $oy.on("input change", function() {
        paper.setOrigin(parseInt($ox.val(), 10), parseInt(this.value, 10));
      });
    }
  }
};
</script>
<style scoped>
.app-header {
  position: relative;
  width: 100%;
}
#paper {
  background: #30d0c6;
}

/*#stencil {
        background: #146DFF;
    }*/
html,
body,
.joint-app {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.app-title {
  display: inline-block;
  width: 240px;
  height: 100%;
  padding: 0;
  background: #30d0c6;
}
.toolbar-container {
  display: inline-block;
  position: absolute;
  height: 100%;
  left: 240px;
  right: 0;
  box-sizing: border-box;
  /*background: red;*/
}
.app-body {
  position: relative;
  height: -moz-calc(100% - 60px);
  height: -webkit-calc(100% - 60px);
  height: calc(100% - 60px);
}
.stencil-container {
  /*position: absolute;*/
  left: 0;
  top: 0;
  /*border-right-color:red;*/
  border-style: solid;
  border-width: 1px;
  width: 50px;
  height: 100%;
  background-color: #9093b1;
}
.paper-container {
  position: absolute;
  top: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  left: 240px;
  right: 240px;
}
.inspector-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 120px;
  width: 240px;
  box-sizing: border-box;
  height: 590px;
  background-color: #9093b1;
}

.joint-inspector {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
}
.joint-inspector.joint-theme-modern {
  color: #c6c7e2;
  background: #383b61;
}
.joint-inspector .group {
  overflow: hidden;
  padding: 0;
  padding-bottom: 10px;
}
.joint-inspector .group > .group-label {
  position: relative;
  padding: 5px 4px;
  margin-top: 0;
  margin-bottom: 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
