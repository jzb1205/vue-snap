<template>
  <div class="drawAside">
    <el-tree :data="treeDataList" node-key='id' :props="defaultProps" @node-click="handleNodeClick"> </el-tree>
  </div>
</template>

<script>
import treeData from "./data.json";
export default {
  name: "drawAside",
  data() {
    return {
      treeDataList: treeData.result,
      defaultProps: {
        children: "children",
        label: "name"
      },
      svgMag: 1, //svg放大倍数
      svgMagMin: 0.1, //svg缩放最小比例
      svgMagMax: 20, //svg缩放最大比例
    };
  },
  created() {

  },
  methods: {
    handleNodeClick(data) {
      if (!data.name.endsWith(".svg")) return 
      console.log(`./svg/${data.name}`)
      this.snapLoad(`./svg/${data.name}`)
    },
    //导入svg图
    snapLoad(svgUrl) {
      // let that = this;
      // this.loading = true;
      // // this.bgRect = null; //清空非导入型背景对象
      // //导入时 先删除已有的 svg#svgContent
      // let svgroot = document.querySelector("#svgroot");
      // let svgContent = svgroot.querySelector("#svgContent");
      // if (svgContent) {
      //   svgroot.removeChild(svgContent);
      // }
      // Snap.load(svgUrl);
      Snap.load(
        svgUrl,
        function(g) {
          // let gL = g.selectAll("g");
          // // that.svgContent.clear();
          // gL.items.map(it => {
          //   //背景层
          //   if (it.node.id === "BackGround_Layer") {
          //     that.importBgObj = it.select("rect");
          //   } else {
          //     return that.EventWrap(it);
          //   }
          // });
          // this.appendChild(g.node);
          // // that.svgContent.clear(); //导出事清空svg
          console.log(g)
        },
        document.querySelector("#svgroot")
      );
      // setTimeout(() => {
        // debugger
        //导入完成时 给新的svg加上id=svgroot 并转化为svg对象
        // let svgroot = document.querySelector("#svgroot");
        // let importSvgContent = svgroot.querySelector("svg");
        // if (!importSvgContent) {
        //     importSvgContent = document.createElement('svg')
        //     importSvgContent.appendChild(svgroot)
        // }
        // importSvgContent.id = "svgContent";
        // importSvgContent.setAttribute("width", this.svgOpt.width);
        // importSvgContent.setAttribute("height", this.svgOpt.height);
        // importSvgContent.setAttribute("viewBox", this.svgOpt.viewBox);
        
        // importSvgContent.setAttribute("width", 1200);
        // importSvgContent.setAttribute("height", 800);
        // importSvgContent.setAttribute("viewBox", '0 0 1200 800');
        // importSvgContent.addEventListener("click", that.mysvgClick, false);

        // that.loading = false;
        // that.svgContent = Snap("#svgContent").drag();
        // this.svgContent.mousemove(function() {
        //   this.attr({
        //     cursor: "move",
        //     fill: "red"
        //   });
        // });
        // this.cancelBH();
        // let svgContent = document.querySelector("#svgContent");
        // if (document.attachEvent) {
        //   svgContent.attachEvent("onmousewheel", that.svgScaleOption);
        // } else {
        //   svgContent.addEventListener("mousewheel", that.svgScaleOption, false);
        // }
      // }, 1000);
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
      let x = $("#workarea").width();
      let y = $("#workarea").height();
      m.translate(x / 2, y / 2);
      m.scale(this.svgMag, this.svgMag);
      // debugger;
      this.svgContent.transform(m);
      console.log(this.svgContent);
      // this.svgContent.drag();
    },
  }
};
</script>
<style lang="less" scoped></style>
