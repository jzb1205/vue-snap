/**
 *类（开断类(负荷开关（合）)）
 *option Object 创建开断类(断路器）所需参数
 * @class terminal
 */
class KG_FHKG {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.id = option.id || "KG_FHKG_H";
    this.symbolId = option.symbolId || "2050010";
    this.attr = {
      //斜线默认样式参数
      xStroke: option.attr.lStroke || "#b94842",
      xStrokeWidth: option.attr.lStrokeWidth || 2,
      xFill: "rgba(0,0,0,0)",
      //中间圆默认样式参数
      mStroke: option.attr.rStroke || "#b94842",
      mStrokeWidth: option.attr.rStrokeWidth || 2,
      mFill: option.attr.mFill || "rgba(0,0,0,0)",
      //右边竖线和横线默认样式参数
      rStroke: option.attr.rStroke || "#b94842",
      rStrokeWidth: option.attr.rStrokeWidth || 2
    };
    this.data = {
      //斜线默认样式参数
      ll: option.data.ll || [15, 40, 25, 40, 55, 20],
      //中间圆绘制默认数据
      cx: option.data.mRx || 48,
      cy: option.data.mRy || 36,
      r: option.data.mRw || 8,
      //右边线绘制默认数据
      rl1: option.data.rl1 || "M55 36L75 36",
      rl2: option.data.rl2 || "M58 25L58 46"
    };
  }
  create() {
    //symbol绘制外框
    let kg_fhkg = this.svgObj.paper.el("symbol", {
      id: this.id,
      symbolId: this.symbolId
    });
    //左线
    let ll = this.svgObj.paper.polyline(this.data.ll).attr({
      stroke: this.attr.xStroke,
      strokeWidth: this.attr.xStrokeWidth,
      fill: this.attr.xFill
    });
    //中间圆
    let circle = this.svgObj.paper
      .circle(this.data.cx, this.data.cy, this.data.r)
      .attr({
        stroke: this.attr.mStroke,
        strokeWidth: this.attr.mStrokeWidth,
        fill: this.attr.mFill
      });
    //右边竖线
    let rl1 = this.svgObj.paper.path(this.data.rl1).attr({
      stroke: this.attr.rStroke,
      strokeWidth: this.attr.rStrokeWidth
    });
    //右边横线
    let rl2 = this.svgObj.paper.path(this.data.rl2).attr({
      stroke: this.attr.rStroke,
      strokeWidth: this.attr.rStrokeWidth
    });
    kg_fhkg.add(ll);
    kg_fhkg.add(circle);
    kg_fhkg.add(rl1);
    kg_fhkg.add(rl2);
    return kg_fhkg;
  }
}
export default KG_FHKG;
