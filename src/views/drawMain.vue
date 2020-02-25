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
      <el-button @click="downLoad">导出</el-button>
      <!-- 背景色 -->
      <el-color-picker
        v-model="backgroundColor"
        show-alpha
        :predefine="predefineColors"
      >
      </el-color-picker>
    </div>
    <div id="workarea">
      <!-- 放一些属性操作div -->
      <div id="editor-container">
        <div>fdasdfsafdagraer</div>
      </div>
      <!-- 负责显示轮廓线、选中框、拖拽控制点等  svg#canvas-->
      <div id="svgroot">
        <svg
          id="svgContent"
          width="1200"
          height="900"
          viewBox="0 0 1200 900"
          @click="mysvgClick"
        ></svg>
      </div>
    </div>
  </div>
</template>

<script>
import common from "./draw/basePel/index";
export default {
  name: "drawMainWrap",
  data() {
    return {
      svgContent: null, //svg内容对象
      svgBg: null, //svg背景对象
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
      ],
      backgroundColor: "rgba(32, 48, 94, 0.1)",
      predefineColors: [
        //默认预选颜色
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ],
      bgRect: null, //背景svg占位对象
      initRectMain: null, //主体svg占位对象
      curpelType: ""
    };
  },
  created() {
    this.$nextTick(function() {
      this.init();
    });
  },
  computed: {
    optionType() {
      return this.$store.state.pencelType || "";
    },
    bgColor() {
      return this.$store.state.bgColor;
    }
  },
  watch: {
    backgroundColor() {
      this.$store.commit("changebgColor", this.backgroundColor);
      this.bgRect.attr({
        fill: this.backgroundColor
      });
    }
  },
  methods: {
    //点击svg外框 添加拖动事件
    cancelBH() {
      let that = this;
      let svg = document.querySelector("#svgContent");
      svg.addEventListener(
        "click",
        function(e) {
          that.svgContent.drag();
        },
        false
      );
    },
    init() {
      this.svgContent = Snap("#svgContent");
      this.cancelBH();
      this.createInitSvg();
      let svgContent = document.querySelector("#svgContent");
      if (document.attachEvent) {
        svgContent.attachEvent("onmousewheel", this.svgScaleOption);
      } else {
        svgContent.addEventListener("mousewheel", this.svgScaleOption, false);
      }
    },
    //创建背景图元
    createInitSvg() {
      let w = document.body.clientWidth - 240;
      let h = document.body.clientHeight - 63;
      let option = {
        svgObj: this.svgContent,
        x: 0,
        y: 0,
        w: w * 3,
        h: h * 3,
        rx: 0,
        ry: 0,
        attr: {
          fill: this.bgColor
        }
      };
      this.bgRect = new common.Rect(option).create();
    },
    createSvgDom() {
      //清楚所有svg元素
      let el = document.querySelector(".drawMain");
      let svgList = el.childNodes;
      for (var i = svgList.length - 1; i >= 0; i--) {
        el.removeChild(svgList[i]);
      }
      // debugger;
      //重新创建svg Dom节点
      let svg = document.createElement("svg");
      svg.id = "svg";
      svg.width = "100%";
      svg.height = "100%";
      document.querySelector(".drawMain").appendChild(svg);
      this.svgContent = Snap("#svg");
    },
    //创建图形
    create() {
      let that = this;
      let e = event || window.event;
      let x = e.pageX - 320;
      let y = e.pageY - 140;
      let option = null;
      switch (this.optionType) {
        case "text":
          option = {
            svgObj: this.svgContent,
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
          text.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "commonline":
          option = {
            svgObj: this.svgContent,
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
          commonline.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "dashLine1":
          option = {
            svgObj: this.svgContent,
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
          dashLine1.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "dashLine2":
          option = {
            svgObj: this.svgContent,
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
          dashLine2.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "dashLine3":
          option = {
            svgObj: this.svgContent,
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
          dashLine3.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "polyline":
          option = {
            svgObj: this.svgContent,
            data: [x + 80, y + 40, x + 80, y + 100, x + 150, y + 100],
            attr: {
              stroke: "#000",
              fill: "#fff",
              strokeWidth: 1,
              cursor: "pointer"
            }
          };
          let polyline = new common.Polyline(option);
          polyline.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;

        case "polygon":
          break;

        case "path":
          break;
        case "circle":
          option = {
            svgObj: this.svgContent,
            cx: x + 100,
            cy: y + 100,
            r: 40,
            attr: {
              stroke: "#000",
              strokeWidth: 1,
              fill: "#fff",
              cursor: "pointer",
              type: "circle"
            }
          };
          let circle = new common.Circle(option);
          let m = new Snap.Matrix();
          let circle1 = circle.create();
          m.scale(this.svgMag, this.svgMag);
          circle1.transform(m);
          circle1.mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "ellipse":
          option = {
            svgObj: this.svgContent,
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
            svgObj: this.svgContent,
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
          rect.create().mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          });
          break;
        case "byq":
          let PolyLineOption = {
            svgObj: this.svgContent,
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
            svgObj: this.svgContent,
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
            svgObj: this.svgContent,
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
          this.svgContent.paper
            .g(polyline1, path, lightning)
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            });
          break;
        default:
          break;
      }
    },
    //创建图形切换
    mysvgClick(event) {
      this.create(event);
      this.$store.commit("changePencelType", "");
    },
    //导图svg
    snapLoad(svgUrl) {
      let that = this;
      Snap.load(svgUrl, function(g) {
        that.svgContent.append(g);
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
      // e.preventDefault();
      // e.stopImmediatePropagation();
      if (e.wheelDelta === -120 || e.detail === 3) {
        this.svgMag -= 0.2;
        if (this.svgMag < this.svgMagMin) {
          this.svgMag = this.svgMagMin;
        }
      } else if (e.wheelDelta === 120 || e.detail === -3) {
        this.svgMag += 0.2;
        if (this.svgMag > this.svgMagMax) {
          this.svgMag = this.svgMagMax;
        }
      }
      m.scale(this.svgMag, this.svgMag);
      this.svgContent.transform(m);
    },
    //导出svg格式图片
    downLoad() {
      let node = document.querySelector("#svgContent").innerHTML;
      let start = `
            <?xml version="1.0" encoding="UTF-8"?>
            <svg width="1272.6000001977" height="900" viewBox="0 0 1272.6000001977 900" coordinateExtent="119.99883653741 29.9969463000312 120.00668763559 30.0024987032688" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  xmlns:cge="http://iec.ch/TC57/2005/SVG-schema#" preserveAspectRatio="xMidYMid">
          `;
      let end = "</svg>";
      let nodeStr = start + node + end;
      var file = new File([nodeStr], "手机号.svg", {
        type: "text/plain;charset=utf-8"
      });
      saveAs(file);
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
#workarea {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
}
#svgroot {
  width: 1200px;
  height: 900px;
}
#svgContent {
  overflow: visible;
  z-index: 101;
}
#svgroot {
  position: relative;
}
svg {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
