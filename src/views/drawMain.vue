<template>
  <div class="drawMainWrap">
    <div class="importAndExport">
      <input
        type="file"
        id="svgImport"
        name="image"
        @click="snapLoad"
        @change="preview($event)"
      />
      <el-button @click="downLoad">导出</el-button>
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
            <li class="optionPanlItem" @click="scale(2)">
              放大
            </li>
            <li class="optionPanlItem" @click="scale(0.5)">
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
        width: "100%",
        height: "100%",
        viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`
      },
      symbolList: {
        BYQ_ZS: null, //柱上变压器（公用变)
        BYQ_SRZ_110_10: null, //110kV-10kV双绕组变压器
        BYQ_SRZ_35_10: null, //35kV-10kV双绕组变压器
        BYQ_SRZ_10_380: null, //10kV-380V双绕组变压器
        KG_DLQ_H: null, //断路器（合）
        KG_DLQ_F: null, //断路器（分）
        KG_FHKG_H: null, //负荷开关（合）
        KG_FHKG_F: null //负荷开关（分）
      },
      curOptPel: null,
      lineOrid: [],
      rotateNum: 0, //旋转角度
      curPoint: {
        x: 0,
        y: 0
      },
      scaleNum: 1
    };
  },
  created() {
    this.$nextTick(function() {
      this.init();
      this.initSymbol(); //初始化symbol列表
    });
  },
  computed: {
    //当前图元操作类型
    optionType() {
      return this.$store.state.pencelType || "";
    },
    //svg背景色
    bgColor() {
      return this.$store.state.bgColor;
    },
    //画笔颜色
    strokeColor() {
      return this.$store.state.lineColor;
    },
    //画笔粗细
    strokeWidth() {
      return this.$store.state.lineWidth;
    },
    //填充颜色
    fillColor() {
      return this.$store.state.fillColor;
    }
  },
  methods: {
    //初始化symbol列表
    initSymbol() {
      //端子
      let option = {
        svgObj: this.svgContent
      };
      /**
       * 柱上变压器（公用变)
       */
      option.symbolId = "2030020";
      option.data = {
        //左边绘制默认数据
        lcx: 45,
        lcy: 20,
        lcr: 10,
        ll: "M20 20L35 20",
        //右边绘制默认数据
        rcx: 55,
        rcy: 20,
        rcr: 10,
        rl: "M65 20L80 20"
      };
      option.attr = {
        //左边默认样式参数
        lStroke: "#0dceff",
        lStrokeWidth: 2,
        lFill: "#d7b09e",
        //右边默认样式参数
        rStroke: "#c05b56",
        rStrokeWidth: 2,
        rFill: "rgba(0,0,0,0)"
      };
      this.symbolList.BYQ_ZS = new Symbol.BYQ_ZS(option).create();
      /**
       * 110kV-10kV双绕组变压器
       */
      option.id = "BYQ_SRZ_110_10";
      option.symbolId = "4020050";
      option.data = {
        //左边绘制默认数据
        lcx: 40,
        lcy: 20,
        lcr: 15,
        ll: "M5 20L25 20",
        //右边绘制默认数据
        rcx: 60,
        rcy: 20,
        rcr: 15,
        rl: "M75 20L95 20"
      };
      option.attr = {
        //左边默认样式参数
        lStroke: "#0dceff",
        lStrokeWidth: 2,
        lFill: "rgba(0,0,0,0)",
        //右边默认样式参数
        rStroke: "#f15668",
        rStrokeWidth: 2,
        rFill: "rgba(0,0,0,0)"
      };
      this.symbolList.BYQ_SRZ_110_10 = new Symbol.BYQ_ZS(option).create();
      /**
       * 35kV-10kV双绕组变压器
       */
      option.id = "BYQ_SRZ_35_10";
      option.symbolId = "4020051";
      option.data = {
        //左边绘制默认数据
        lcx: 40,
        lcy: 20,
        lcr: 15,
        ll: "M5 20L25 20",
        //右边绘制默认数据
        rcx: 60,
        rcy: 20,
        rcr: 15,
        rl: "M75 20L95 20"
      };
      option.attr = {
        //左边默认样式参数
        lStroke: "#b54842",
        lStrokeWidth: 2,
        lFill: "rgba(0,0,0,0)",
        //右边默认样式参数
        rStroke: "#ffff4a",
        rStrokeWidth: 2,
        rFill: "rgba(0,0,0,0)"
      };
      this.symbolList.BYQ_SRZ_35_10 = new Symbol.BYQ_ZS(option).create();
      /**
       * 10kV-380kV双绕组变压器
       */
      option.id = "BYQ_SRZ_10_380";
      option.symbolId = "4020052";
      option.data = {
        //左边绘制默认数据
        lcx: 40,
        lcy: 20,
        lcr: 15,
        ll: "M5 20L25 20",
        //右边绘制默认数据
        rcx: 60,
        rcy: 20,
        rcr: 15,
        rl: "M75 20L95 20"
      };
      option.attr = {
        //左边默认样式参数
        lStroke: "#06ccfe",
        lStrokeWidth: 2,
        lFill: "rgba(0,0,0,0)",
        //右边默认样式参数
        rStroke: "#b94c46",
        rStrokeWidth: 2,
        rFill: "rgba(0,0,0,0)"
      };
      this.symbolList.BYQ_SRZ_10_380 = new Symbol.BYQ_ZS(option).create();
      /**
       * 断路器（合）
       */
      option.id = "KG_DLQ_H";
      option.symbolId = "2040010";
      option.data = {
        //左边线绘制默认数据
        ll: "M5 20L20 20",
        //中间矩形绘制默认数据
        mRx: 20,
        mRy: 12,
        mRw: 30,
        mRh: 15,
        mRrx: 0,
        mRry: 0,
        //右边线绘制默认数据
        rl: "M50 20L65 20"
      };
      option.attr = {
        //左边线默认样式参数
        lStroke: "#b94842",
        lStrokeWidth: 2,
        //中间矩形默认样式参数
        mStroke: "#b94842",
        mStrokeWidth: 2,
        mFill: "#b94842",
        //右边线默认样式参数
        rStroke: "#b94842",
        rStrokeWidth: 2
      };
      this.symbolList.KG_DLQ_H = new Symbol.KG_DLQ(option).create();
      /**
       * 断路器（分）
       */
      option.id = "KG_DLQ_F";
      option.symbolId = "2040011";
      option.data = {
        //左边线绘制默认数据
        ll: "M5 20L20 20",
        //中间矩形绘制默认数据
        mRx: 20,
        mRy: 12,
        mRw: 30,
        mRh: 15,
        mRrx: 0,
        mRry: 0,
        //右边线绘制默认数据
        rl: "M50 20L65 20"
      };
      option.attr = {
        //左边线默认样式参数
        lStroke: "#b94842",
        lStrokeWidth: 2,
        //中间矩形默认样式参数
        mStroke: "#b94842",
        mStrokeWidth: 2,
        mFill: "rgba(0,0,0,0)",
        //右边线默认样式参数
        rStroke: "#b94842",
        rStrokeWidth: 2
      };
      this.symbolList.KG_DLQ_F = new Symbol.KG_DLQ(option).create();
      /**
       * 负荷开关（合）
       */
      option.id = "KG_FHKG_H";
      option.symbolId = "2050010";
      option.data = {
        //斜线默认样式参数
        ll: [10, 40, 20, 40, 55, 20],
        //中间圆绘制默认数据
        cx: 48,
        cy: 36,
        r: 8,
        //右边线绘制默认数据
        rl1: "M55 36L75 36",
        rl2: "M58 25L58 46"
      };
      option.attr = {
        //斜线默认样式参数
        xStroke: "#b94842",
        xStrokeWidth: 2,
        xFill: "rgba(0,0,0,0)",
        //中间圆默认样式参数
        mStroke: "#b94842",
        mStrokeWidth: 2,
        mFill: "rgba(0,0,0,0)",
        //右边竖线和横线默认样式参数
        rStroke: "#b94842",
        rStrokeWidth: 2
      };
      this.symbolList.KG_FHKG_H = new Symbol.KG_FHKG(option).create();
      /**
       * 负荷开关（分）
       */
      option.id = "KG_FHKG_F";
      option.symbolId = "2050011";
      option.data = {
        //斜线默认样式参数
        ll: [10, 40, 20, 40, 48, 15],
        //中间圆绘制默认数据
        cx: 48,
        cy: 36,
        r: 8,
        //右边线绘制默认数据
        rl1: "M55 36L75 36",
        rl2: "M58 25L58 46"
      };
      option.attr = {
        //斜线默认样式参数
        xStroke: "#b94842",
        xStrokeWidth: 2,
        xFill: "rgba(0,0,0,0)",
        //中间圆默认样式参数
        mStroke: "#b94842",
        mStrokeWidth: 2,
        mFill: "rgba(0,0,0,0)",
        //右边竖线和横线默认样式参数
        rStroke: "#b94842",
        rStrokeWidth: 2
      };
      this.symbolList.KG_FHKG_F = new Symbol.KG_FHKG(option).create();
    },
    //初始化
    init() {
      this.svgContent = Snap("#svgContent").click(function() {
        this.attr({
          cursor: "pointer"
        });
      });
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
      let svgroot = document.querySelector("#svgroot");
      let e = event || window.event;
      let x = e.pageX - 320;
      let y = e.pageY - 140;
      let option = null;
      let pel = null;
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
          pel = new common.Text(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
          pel = new common.Line(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
          pel = new common.Line(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
          pel = new common.Line(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
          pel = new common.Line(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
              fill: "rgba(0,0,0,0)",
              strokeWidth: 1,
              cursor: "pointer",
              optionType: "polyline"
            }
          };
          pel = new common.Polyline(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
              fill: "rgba(0,0,0,0)",
              cursor: "pointer",
              id: ""
            }
          };
          pel = new common.Circle(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .hover(
              function() {
                // 移入
                this.attr(
                  {
                    fill: "#00f" // 蓝色
                  },
                  1000
                );
              },
              function() {
                // 移出
                this.animate(
                  {
                    fill: "#f00" // 红色
                  },
                  1000
                );
              }
            )
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
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
              fill: "rgba(0,0,0,0)",
              cursor: "pointer",
              optionType: "ellipse"
              // transform:new Snap.Matrix(2,0,0,1,50,50)
            }
          };
          pel = new common.Ellipse(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
              fill: "rgba(0,0,0,0)",
              cursor: "pointer",
              optionType: "rect"
            }
          };
          pel = new common.Rect(option).create();
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "BYQ_ZS":
          pel = this.svgContent.paper.g(that.symbolList.BYQ_ZS.use()).attr({
            id: "156516",
            width: 20,
            height: 100
          });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              that.curOptPel = pel;
              that.openAttrOptionPanl(e);
              that.curPoint.x = pel.getBBox().cx;
              that.curPoint.y = pel.getBBox().cy;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this
                .drag
                // function() {
                //   console.log("onmove", this);
                // },
                // function() {
                //   console.log("OnStart", this);
                // },
                // function() {
                //   console.log("onend", this.getBBox());
                // }
                ();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "BYQ_SRZ_110_10":
          pel = this.svgContent.paper
            .g(that.symbolList.BYQ_SRZ_110_10.use())
            .attr({
              id: "156516",
              width: 20,
              height: 100
            });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          break;
        case "BYQ_SRZ_35_10":
          pel = this.svgContent.paper
            .g(that.symbolList.BYQ_SRZ_35_10.use())
            .attr({
              id: "156516",
              width: 20,
              height: 100
            });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });
          break;
        case "BYQ_SRZ_10_380":
          pel = this.svgContent.paper
            .g(that.symbolList.BYQ_SRZ_10_380.use())
            .attr({
              id: "156516",
              width: 20,
              height: 100
            });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          break;

        case "KG_DLQ_H":
          pel = this.svgContent.paper.g(that.symbolList.KG_DLQ_H.use()).attr({
            id: "156516",
            width: 20,
            height: 100
          });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          break;

        case "KG_DLQ_F":
          pel = this.svgContent.paper.g(that.symbolList.KG_DLQ_F.use()).attr({
            id: "156516",
            width: 20,
            height: 100
          });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          break;
        case "KG_FHKG_H":
          pel = this.svgContent.paper.g(that.symbolList.KG_FHKG_H.use()).attr({
            id: "156516",
            width: 20,
            height: 100
          });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function(e) {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
            })
            .dblclick(function(e) {
              that.openAttrOptionPanl(e);
            });

          break;
        case "KG_FHKG_F":
          pel = this.svgContent.paper.g(that.symbolList.KG_FHKG_F.use()).attr({
            id: "15651615" + Math.random() * 0.1,
            width: 20,
            height: 100
          });
          pel.mouseover(function() {
            document.oncontextmenu = function(e) {
              e.preventDefault();
              console.log(pel);
              that.curOptPel = pel;
              that.optionPanlBool = true;
            };
          });
          pel
            .mousedown(function(e) {
              e.stopPropagation();
              that.svgContent.undrag();
              this.drag();
            })
            .click(function() {
              that.curOptPel = this;
              Event.click(that.svgContent, this);
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
    },
    //获取导入svg图片本地路径
    preview() {
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
        e.preventDefault();
        this.svgMag -= 0.5;
        if (this.svgMag < this.svgMagMin) {
          this.svgMag = this.svgMagMin;
        }
      } else if (e.wheelDelta === 120 || e.detail === -3) {
        e.preventDefault();
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
      let m = new Snap.Matrix();
      this.rotateNum -= 90;
      m.rotate(this.rotateNum, this.curPoint.x, this.curPoint.y);
      this.curOptPel.transform(m);
      this.optionPanlBool = !this.optionPanlBool;
    },
    scale(num) {
      let m = new Snap.Matrix();
      if (num === 2) {
        this.scaleNum += 0.5;
      } else {
        this.scaleNum -= 0.5;
      }
      console.log(this.scaleNum);
      m.scale(this.scaleNum, this.scaleNum, this.curPoint.x, this.curPoint.y);
      this.curOptPel.transform(m);
      this.optionPanlBool = !this.optionPanlBool;
    }
  },
  watch: {
    bgColor() {
      console.log(123);
      this.bgRect.attr({
        fill: this.bgColor
      });
    }
  }
};
</script>
<style lang="less" scoped>
.drawMainWrap {
  position: absolute;
  width: 100%;
  height: calc(100% - 40px);
}
.importAndExport {
  height: 40px;
  line-height: 40px;
  background: #1d272e;
}
#svgImport {
  margin: 0 20px;
}
input[type="file"] {
  color: #fff;
}
#workarea {
  width: 100%;
  height: 100%;
  background: #000;
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
