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
      <transition name="el-fade-in">
        <div id="editor-container" v-show="optionPanlBool">
          <p>
            <i
              class="el-icon-close"
              @click="optionPanlBool = !optionPanlBool"
            ></i>
          </p>
          <ul class="optionPanl">
            <li class="optionPanlItem" @click="rotateDeg">
              旋转90度
            </li>
            <li class="optionPanlItem" @click="scaleNum(2)">
              放大
            </li>
            <li class="optionPanlItem" @click="scaleNum(0.5)">
              缩小
            </li>
          </ul>
        </div>
      </transition>
      <!-- 负责显示轮廓线、选中框、拖拽控制点等  svg#canvas-->
      <div id="svgroot">
        <svg
          id="svgContent"
          :width="svgOpt.width"
          :height="svgOpt.height"
          :viewBox="svgOpt.viewBox"
          @click="mysvgClick"
        ></svg>
      </div>
    </div>
  </div>
</template>

<script>
import common from "./../draw/basePel/index";
import Event from "./../event/index";
import Symbol from "./../draw/symbol/index";
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
      curpelType: "", //当前点击图元类型
      optionPanlBool: false, //操作弹窗bool
      svgOpt: {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`
      },
      symbolList: {
        Breaker: null
      },
      curOptPel: null
    };
  },
  created() {
    this.$nextTick(function() {
      this.init();
      this.initSymbol(); //初始化symbol列表
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
  methods: {
    //初始化symbol列表
    initSymbol() {
      let that = this;
      //端子
      let option = {
        svgObj: this.svgContent
      };
      this.Breaker = new Symbol.Breaker(option).create();
    },
    //初始化
    init() {
      this.svgContent = Snap("#svgContent").click(function() {
        this.attr({
          cursor: "pointer"
        });
      });
      console.log(this.svgContent);
      this.cancelBH();
      this.createInitSvg();
      let svgContent = document.querySelector("#svgContent");
      if (document.attachEvent) {
        svgContent.attachEvent("onmousewheel", this.svgScaleOption);
      } else {
        svgContent.addEventListener("mousewheel", this.svgScaleOption, false);
      }
    },
    //点击svg外框 添加拖动事件
    cancelBH() {
      let that = this;
      let svg = document.querySelector("#svgContent");
      svg.addEventListener(
        "click",
        function() {
          // console.log("svg");
          that.svgContent.drag();
        },
        false
      );
    },
    //创建背景图元
    createInitSvg() {
      let w = document.body.clientWidth;
      let h = document.body.clientHeight;
      let option = {
        svgObj: this.svgContent,
        x: 0,
        y: 0,
        w: w,
        h: h,
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
      let t1 = null; //端子1
      let t1Option = null; //端子1参数
      let t2 = null; //端子2
      let t2Option = null; //端子2参数

      //绘制图元
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
              cursor: "pointer",
              optionType: "text"
            }
          };
          new common.Text(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              fill: "red",
              optionType: "commonline"
            }
          };
          new common.Line(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              fill: "red",
              optionType: "dashLine1"
            }
          };
          new common.Line(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              fill: "red",
              optionType: "dashLine2"
            }
          };
          new common.Line(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              fill: "red",
              optionType: "dashLine3"
            }
          };
          new common.Line(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              cursor: "pointer",
              optionType: "polyline"
            }
          };
          new common.Polyline(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "circle":
          option = {
            svgObj: this.svgContent,
            cx: x + 50,
            cy: y + 50,
            r: 20,
            attr: {
              stroke: "#b94842",
              strokeWidth: 1,
              fill: "#fff",
              cursor: "pointer",
              id: ""
            }
          };
          t1Option = {
            svgObj: this.svgContent,
            cx: 50,
            cy: 50,
            r: 8,
            attr: {
              stroke: "rgb(0,200,255)",
              strokeWidth: 1,
              fill: "none",
              cursor: "pointer",
              id: "t1"
            }
          };
          t2Option = {
            svgObj: this.svgContent,
            cx: 50,
            cy: 120,
            r: 8,
            attr: {
              stroke: "rgb(0,200,255)",
              strokeWidth: 1,
              fill: "none",
              cursor: "pointer"
            },
            id: "t2"
          };
          t1 = new common.Circle(t1Option).create();
          t2 = new common.Circle(t2Option).create();
          let c = this.svgContent.paper
            .g(this.Breaker.use(), t1, t2)
            .attr({
              id: "156516"
            })
            .drag();
          c.mousedown(function(e) {
            e.stopPropagation();
            that.svgContent.undrag();
            this.drag();
          })
            .click(function(e) {
              that.curOptPel = this;
              console.log(this);
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          console.log(that.svgContent);
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
              cursor: "pointer",
              optionType: "ellipse"
              // transform:new Snap.Matrix(2,0,0,1,50,50)
            }
          };
          new common.Ellipse(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
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
              cursor: "pointer",
              optionType: "rect"
            }
          };
          new common.Rect(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "byq":
          option = {
            svgObj: this.svgContent,
            polyLineOption: {
              data: [x + 80, y + 80, x + 110, y + 60, x + 140, y + 80],
              attr: {
                stroke: "#bd524c",
                fill: "none",
                strokeWidth: 3
              }
            },
            pathOption: {
              data: `M${x + 83} ${y + 84}L${x + 110} ${y + 67}L${x + 137} ${y +
                84}L${x + 137} ${y + 117}L${x + 84} ${y + 117}L${x + 83} ${y +
                83}Z`,
              attr: {
                stroke: "#bd524c",
                fill: "#fff",
                strokeWidth: 2
              }
            },
            lightningOption: {
              data: `M${x + 97} ${y + 93}L${x + 123} ${y + 81}L${x + 110} ${y +
                93}L${x + 124} ${y + 93}L${x + 97} ${y + 110}L${x + 113} ${y +
                93}Z`,
              attr: {
                stroke: "#bd524c",
                fill: "#bd524c",
                strokeWidth: 2
              }
            }
          };
          new pel.BYQ(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              this.attr({
                id: "abc"
              });
              console.log(this);
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "kg":
          option = {
            svgObj: this.svgContent,
            attr: {
              stroke: "#000",
              strokeWidth: 2,
              strokeDasharray: "",
              cursor: "pointer",
              fill: "red",
              optionType: "commonline"
            },
            lineData1: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData2: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 10,
              y2: y + 50
            },
            lineData3: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData4: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData5: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData6: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData7: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData8: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData9: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            lineData10: {
              x1: x + 100,
              y1: y + 100,
              x2: x + 150,
              y2: y + 50
            },
            rectData: {
              x: x + 75,
              y: y + 75,
              w: 50,
              h: 50,
              rx: 0,
              ry: 0
            }
          };
          new pel.BYQ(option)
            .create()
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              console.log(this);
              Event.click(this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
    //导入svg图
    snapLoad(svgUrl) {
      let that = this;
      Snap.load(svgUrl, function(g) {
        that.svgContent.clear(); //导出事清空svg
        that.svgContent.append(g);
      });
      // setTimeout(function() {
      // console.log(document.querySelector("#svg"));
      // let layer = document.querySelector("#PD_30200003_450982");
      // console.log(layer);
      // }, 3000);
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
        this.svgMag -= 0.5;
        if (this.svgMag < this.svgMagMin) {
          this.svgMag = this.svgMagMin;
        }
      } else if (e.wheelDelta === 120 || e.detail === -3) {
        this.svgMag += 0.5;
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
    },
    //打开属性操作框
    openAttrOptionPanl(e) {
      this.$nextTick(function() {
        this.optionPanlBool = true;
        let optionPanl = document.querySelector("#editor-container");
        optionPanl.style.top = e.clientY - 100 + "px";
        optionPanl.style.left = e.clientX - 220 + "px";
      });
    },
    rotateDeg() {
      console.log(this.curOptPel.transform());
      let m = new Snap.Matrix();
      m.rotate(-90, 100, 100);
      this.curOptPel.transform(m);
      this.optionPanlBool = !this.optionPanlBool;
    },
    scaleNum(num) {
      console.log(this.curOptPel.transform());
      let m = new Snap.Matrix();
      m.scale(num, num, 100, 100);
      this.curOptPel.transform(m);
      this.optionPanlBool = !this.optionPanlBool;
    }
  },
  watch: {
    backgroundColor() {
      this.$store.commit("changebgColor", this.backgroundColor);
      this.bgRect.attr({
        fill: this.backgroundColor
      });
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
  z-index: 100;
}
#editor-container {
  position: absolute;
  width: 120px;
  height: auto;
  z-index: 1000;
  background: #ccc;
  cursor: pointer;
  border-radius: 5px;
  padding: 20px;
  p {
    text-align: right;
  }
  ul {
    li {
      line-height: 35px;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>
