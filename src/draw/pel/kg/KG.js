/**
 *类（开关）
 *option Object 创建开关所需参数
 * @class KG
 */
class KG {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.attr = option.attr || {}; // 样式等属性
    this.lineData1 = option.line1Data || {};
    this.lineData2 = option.line1Data || {};
    this.lineData3 = option.line1Data || {};
    this.lineData4 = option.line1Data || {};
    this.lineData5 = option.line1Data || {};
    this.lineData6 = option.line1Data || {};
    this.lineData7 = option.line1Data || {};
    this.lineData8 = option.line1Data || {};
    this.lineData9 = option.line1Data || {};
    this.lineData10 = option.line1Data || {};
    this.lineData10 = option.line1Data || {};
    this.rectData = option.rectData || {};
  }

  create() {
    let line1 = this.svgObj.paper
      .line(this.x1, this.y1, this.x2, this.y2)
      .attr(this.attr);
    let kg = this.svgObj
      .g(
        line1,
        line2,
        line3,
        line4,
        line5,
        line6,
        line7,
        line8,
        line9,
        line10,
        rect
      )
      .attr({
        cursor: "pointer"
      });
    return kg;
  }
}
export default KG;
