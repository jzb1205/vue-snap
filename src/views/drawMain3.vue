<template>
  <div class="drawMainWrap">
    <div
      id="workarea"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0)"
    >
      <div id="svgroot">
        <svg
          id="svgContent"
          :width="svgOpt.width"
          :height="svgOpt.height"
          :viewBox="svgOpt.viewBox"
        ></svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "drawMainWrap",
  data() {
    return {
      svgContent: null, //svg内容对象
      svgBg: null, //svg背景对象
      svgMag: 1, //svg放大倍数
      svgMagMin: 0.1, //svg缩放最小比例
      svgMagMax: 20, //svg缩放最大比例
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
      curOptPel: null, //当前操作的图元对象
      rotateNum: 0, //旋转角度
      curPoint: {
        //当前操作图元对象的坐标
        x: 0,
        y: 0
      },
      aheadPoint: {
        x: 0,
        y: 0
      },
      scaleNum: 1, //svg缩放倍数
      loading: false, //导入svg时样式
      importBgObj: null, //导入时 的背景对象
      timer: null
    };
  },
  created() {
    let that = this;
    this.$nextTick(function() {
      var s = Snap("#svgContent");
      s.cx = 40;
      s.cy = 140;
      s.ox = 0;
      s.oy = 0;
      let rect = s
        .rect(0, 0, 100, 100)
        .attr({ fill: "blue", cursor: "pointer" })
        .drag(that.dragging, startDrag, function(evt) {
          console.log("dropped at: " + evt.x + ", " + evt.y);
        });
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
      return this.$store.state.strokeColor;
    },
    //画笔粗细
    strokeWidth() {
      return this.$store.state.strokeWidth;
    },
    //填充颜色
    fillColor() {
      return this.$store.state.fillColor;
    },
    //属性面板切换
    attrPalToggle() {
      return this.$store.state.attrPalToggle;
    },
    //连接线样式
    joinLineType() {
      return this.$store.state.joinLineType;
    }
  },
  methods: {
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
      let g = this.svgContent.paper.g().attr({
        id: "BackGround_Layer"
      });
    },
    startDrag(posx, posy) {
      debugger;
      this.ox = posx - this.cx;
      this.oy = posy - this.cy;
    },

    dragging(dx, dy, posx, posy) {
      this.cx = posx - this.ox;
      this.cy = posy - this.oy;
      let t = "t" + this.cx + "," + this.cy;
      that.transform(t);
    }
  },
  watch: {
    bgColor() {
      if (this.bgRect) {
        this.bgRect.attr({
          fill: this.bgColor
        });
      }
      if (this.importBgObj) {
        this.importBgObj.attr({
          fill: this.bgColor
        });
      }
    }
    // loading() {
    //   if (!this.loading) {
    //     clearInterval(this.timer);
    //   }
    // }
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
  // width: 1200px;
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
.downLoad {
  background: #2a353d;
  border-color: #121a1f;
  color: #fff;
  display: inline-block;
  height: 30px;
  line-height: 35px;
  padding: 0 6px;
  position: absolute;
  top: 5px;
  border: 1px solid #121a1f;
  cursor: pointer;
  img {
    position: relative;
    top: 3px;
    margin-right: 3px;
  }
}
.toggle {
  color: #fff;
  line-height: 40px;
  margin-right: 20px;
  cursor: pointer;
}
</style>
