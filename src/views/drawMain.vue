<template>
  <div class="drawMainWrap">
    <div>
      <input
        type="file"
        id="svgImport"
        name="image"
        @click="snapLoad"
        @change="preview($event)"
      />
    </div>
    <!-- <div class="attributeSet">

    </div> -->
    <div class="drawMain">
      <svg id="svg" width="100%" height="100%" @click="mysvgClick"></svg>
    </div>
  </div>
</template>

<script>
import common from "./draw/basePel/index";
export default {
  name: "drawMainWrap",
  data() {
    return {
      optionType: sessionStorage.getItem("optionType") || "", //当前操作类型
      svg: null, //svg对象
      svgMag: 1, //svg放大倍数
      svgMagMin: 0.1, //svg缩放最小比例
      svgMagMax: 20, //svg缩放最大比例
      attributeSetData: [
        {
          id: "borderColor",
          name: "边框颜色",
          tyle: "color"
        },
        {
          id: "lineWidth",
          name: "线条宽度",
          tyle: "width"
        },
        {
          id: "fillColor",
          name: "填充颜色",
          tyle: "color"
        }
      ]
    };
  },
  created() {
    this.$nextTick(function() {
      this.svg = Snap("#svg");
      let svgScale = document.querySelector("#svg");
      if (document.attachEvent) {
        svgScale.attachEvent("onmousewheel", this.svgScaleOption);
      } else {
        svgScale.addEventListener("mousewheel", this.svgScaleOption, false);
      }
    });
  },
  methods: {
    //创建图形
    create() {
      console.log(document.querySelector("#svg").innerHTML);
      let that = this;
      let e = event || window.event;
      let x = e.pageX - 320;
      let y = e.pageY - 140;
      this.optionType = sessionStorage.getItem("optionType") || "";
      let option = null;
      switch (this.optionType) {
        case "text":
          option = {
            svgObj: this.svg,
            x: x + 100,
            y: y + 100,
            text: "snap",
            attr: {
              stroke: "#000",
              strokeWidth: 1,
              cursor: "pointer"
            }
          };
          let text = new common.Text(option);
          text
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "commonline":
          option = {
            svgObj: this.svg,
            x1: x + 100,
            y1: y + 100,
            x2: x + 150,
            y2: y,
            attr: {
              stroke: "#000",
              strokeWidth: 2,
              strokeDasharray: "",
              cursor: "pointer",
              fill: "red"
            }
          };
          let commonline = new common.Line(option);
          commonline
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "dashLine1":
          option = {
            svgObj: this.svg,
            x1: x + 100,
            y1: y + 100,
            x2: x + 150,
            y2: y,
            attr: {
              stroke: "#000",
              strokeWidth: 2,
              strokeDasharray: "5,5",
              cursor: "pointer",
              fill: "red"
            }
          };
          let dashLine1 = new common.Line(option);
          dashLine1
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "dashLine2":
          option = {
            svgObj: this.svg,
            x1: x + 100,
            y1: y + 100,
            x2: x + 150,
            y2: y,
            attr: {
              stroke: "#000",
              strokeWidth: 2,
              strokeDasharray: "10,10",
              cursor: "pointer",
              fill: "red"
            }
          };
          let dashLine2 = new common.Line(option);
          dashLine2
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "dashLine3":
          option = {
            svgObj: this.svg,
            x1: x + 100,
            y1: y + 100,
            x2: x + 150,
            y2: y,
            attr: {
              stroke: "#000",
              strokeWidth: 2,
              strokeDasharray: "20,10,5,5,5,10",
              cursor: "pointer",
              fill: "red"
            }
          };
          let dashLine3 = new common.Line(option);
          dashLine3
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "polyline":
          option = {
            svgObj: this.svg,
            data: [x + 80, y + 40, x + 80, y + 100, x + 150, y + 100],
            attr: {
              stroke: "#000",
              fill: "#fff",
              strokeWidth: 1,
              cursor: "pointer"
            }
          };
          console.log(this.svg);
          let polyline = new common.Polyline(option);
          polyline
            .create()
            .drag()
            .click(function() {
              console.log(this.matrix);
            });
          break;

        case "polygon":
          break;

        case "path":
          break;
        case "circle":
          option = {
            svgObj: this.svg,
            cx: x + 100,
            cy: y + 100,
            r: 40,
            attr: {
              stroke: "#000",
              strokeWidth: 1,
              fill: "#fff",
              cursor: "pointer"
            }
          };
          let circle = new common.Circle(option);
          circle
            .create()
            .drag()
            .click(function() {
              console.log(this);
              // console.log(that.svg.innerSVG());
              console.log(Snap.selectAll("circle"));
            });
          break;
        case "ellipse":
          option = {
            svgObj: this.svg,
            cx: x + 100,
            cy: y + 100,
            rx: 100,
            ry: 40,
            attr: {
              stroke: "#000",
              strokeWidth: 1,
              fill: "#fff",
              cursor: "pointer"
              // transform:new Snap.Matrix(2,0,0,1,50,50)
            }
          };
          let ellipse = new common.Ellipse(option);
          ellipse.create().drag();
          break;
        case "rect":
          option = {
            svgObj: this.svg,
            x: x + 75,
            y: y + 75,
            w: 50,
            h: 50,
            rx: 0,
            ry: 0,
            attr: {
              stroke: "#000",
              strokeWidth: 1,
              fill: "#fff",
              cursor: "pointer"
            }
          };
          let rect = new common.Rect(option);
          rect
            .create()
            .drag()
            .click(function() {
              console.log(this);
            });
          break;
        case "byq":
          console.log(x, y);
          let PolyLineOption = {
            svgObj: this.svg,
            data: [x + 80, y + 80, x + 110, y + 60, x + 140, y + 80],
            attr: {
              stroke: "#bd524c",
              fill: "none",
              strokeWidth: 3,
              cursor: "pointer"
            }
          };
          let polyline1 = new common.Polyline(PolyLineOption).create();
          let pathOption = {
            svgObj: this.svg,
            data: `M${x + 83} ${y + 84}L${x + 110} ${y + 67}L${x + 137} ${y +
              84}L${x + 137} ${y + 117}L${x + 84} ${y + 117}L${x + 83} ${y +
              83}Z`,
            attr: {
              stroke: "#bd524c",
              fill: "#fff",
              strokeWidth: 2,
              cursor: "pointer"
            }
          };
          let path = new common.Path(pathOption).create();
          let lightningOption = {
            svgObj: this.svg,
            data: `M${x + 97} ${y + 93}L${x + 123} ${y + 81}L${x + 110} ${y +
              93}L${x + 124} ${y + 93}L${x + 97} ${y + 110}L${x + 113} ${y +
              93}Z`,
            attr: {
              stroke: "#bd524c",
              fill: "#bd524c",
              strokeWidth: 2,
              cursor: "pointer"
            }
          };
          let lightning = new common.Path(lightningOption).create();
          this.svg.paper
            .g(polyline1, path, lightning)
            .drag()
            .click(function() {
              console.log(1231);
            });
          break;
        default:
          break;
      }
    },
    //创建图形切换
    mysvgClick(event) {
      this.create(event);
      sessionStorage.setItem("optionType", "");
    },
    //导图svg
    snapLoad(svgUrl) {
      let that = this;
      that.svg.removeData();
      Snap.load(svgUrl, function(g) {
        console.log(g);
        that.svg.append(g).drag();
      });
    },
    //获取导入svg图片本地路径
    preview(event) {
      this.snapLoad(
        this.getObjectURL(document.getElementById("svgImport").files[0])
      );
    },
    //svg图片浏览器兼容
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      }
      return url;
    },
    //svg缩放
    svgScaleOption(e) {
      let m = new Snap.Matrix();
      if (e.wheelDelta === -120 || e.detail === 3) {
        this.svgMag += 0.2;
        if (this.svgMag > this.svgMagMax) {
          this.svgMag = this.svgMagMax;
        }
      } else if (e.wheelDelta === 120 || e.detail === -3) {
        this.svgMag -= 0.2;
        if (this.svgMag < this.svgMagMin) {
          this.svgMag = this.svgMagMin;
        }
      }
      m.scale(this.svgMag, this.svgMag);
      this.svg.transform(m);
    }
  }
};
</script>
<style lang="less" scoped>
.drawMainWrap {
  position: absolute;
  width: calc(100% - 40px);
  height: calc(100% - 65px);
}
.drawMain {
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid #ddd;
  #editor-container {
    height: 100%;
  }
  #mysvg {
    height: 100%;
    overflow: hidden;
    margin: 5px;
  }
}
#svg {
  position: "relative";
}
</style>
