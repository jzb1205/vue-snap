/**
 *类（开断类(断路器）)
 *option Object 创建开断类(断路器）所需参数
 * @class terminal
 */
class KG_DLQ {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.id = option.id || "KG_DLQ";
    this.symbolId = option.symbolId || "";
    this.attr = {
      //左边线默认样式参数
      lStroke: option.attr.lStroke || "#b94842",
      lStrokeWidth: option.attr.lStrokeWidth || 2,
      //中间矩形默认样式参数
      mStroke: option.attr.rStroke || "#b94842",
      mStrokeWidth: option.attr.rStrokeWidth || 2,
      mFill: option.attr.mFill || "rgba(0,0,0,0)",
      //右边线默认样式参数
      rStroke: option.attr.rStroke || "#b94842",
      rStrokeWidth: option.attr.rStrokeWidth || 2
    };
    this.data = {
      //左边线绘制默认数据
      ll: option.data.ll || "M5 20L25 20",
      //中间矩形绘制默认数据
      mRx: option.data.mRx || 10,
      mRy: option.data.mRy || 10,
      mRw: option.data.mRw || 40,
      mRh: option.data.mRh || 20,
      mRrx: option.data.mRrx || 0,
      mRry: option.data.mRry || 0,
      //右边线绘制默认数据
      rl: option.data.rl || "M75 20L95 20"
    };
  }
  create() {
    //symbol绘制外框
    let kg_dlq = this.svgObj.paper.el("symbol", {
      id: this.id,
      symbolId: this.symbolId
    });
    //左线
    let ll = this.svgObj.paper.path(this.data.ll).attr({
      stroke: this.attr.lStroke,
      strokeWidth: this.attr.lStrokeWidth
    });
    //中间矩形
    let mR = this.svgObj.paper
      .rect(
        this.data.mRx,
        this.data.mRy,
        this.data.mRw,
        this.data.mRh,
        this.data.mRrx,
        this.data.mRry
      )
      .attr({
        stroke: this.attr.mStroke,
        strokeWidth: this.attr.mStrokeWidth,
        fill: this.attr.mFill
      });
    let rl = this.svgObj.paper.path(this.data.rl).attr({
      stroke: this.attr.rStroke,
      strokeWidth: this.attr.rStrokeWidth
    });
    kg_dlq.add(ll);
    kg_dlq.add(mR);
    kg_dlq.add(rl);
    return kg_dlq;
  }
}
export default KG_DLQ;
