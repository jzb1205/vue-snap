/**
 *类（柱上变压器（公用变））
 *option Object 创建柱上变压器（公用变）所需参数
 * @class terminal
 */
class BYQ_ZS {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.id = option.id || "BYQ_ZS";
    this.attr = option.attr || {
      //左边默认样式参数
      lStroke: "#0dceff",
      lStrokeWidth: 2,
      lFill: "#d7b09e",
      //右边默认样式参数
      rStroke: "#c05b56",
      rStrokeWidth: 2,
      rFill: "rgba(0,0,0,0)"
    };
    this.data = option.data || {
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
  }
  create() {
    //symbol绘制外框
    let byq_zs = this.svgObj.paper.el("symbol", {
      id: this.id,
      symbolId: "2030020"
    });
    //左圆
    let lc = this.svgObj.paper
      .circle(this.data.lcx, this.data.lcy, this.data.lcr)
      .attr({
        stroke: this.attr.lStroke,
        strokeWidth: this.attr.lStrokeWidth,
        fill: this.attr.lFill
      });
    //右圆
    let rc = this.svgObj.paper
      .circle(this.data.rcx, this.data.rcy, this.data.rcr)
      .attr({
        stroke: this.attr.rStroke,
        strokeWidth: this.attr.rStrokeWidth,
        fill: this.attr.rFill
      });
    //左线
    let ll = this.svgObj.paper.path(this.data.ll).attr({
      stroke: this.attr.lStroke,
      strokeWidth: this.attr.lStrokeWidth
    });
    //右线
    let lr = this.svgObj.paper.path(this.data.rl).attr({
      stroke: this.attr.rStroke,
      strokeWidth: this.attr.rStrokeWidth
    });
    byq_zs.add(lc);
    byq_zs.add(rc);
    byq_zs.add(ll);
    byq_zs.add(lr);
    return byq_zs;
  }
}
export default BYQ_ZS;
