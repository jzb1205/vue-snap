/**
 *类（变压器）
 *option Object 创建变压器所需参数
 * @class BYQ
 */
class BYQ {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.option = option || {};
  }
  create() {
    let polyline = this.svgObj.paper
      .polyline(this.option.polyLineOption.data)
      .attr(this.option.polyLineOption.attr);
    let path = this.svgObj.paper
      .path(this.option.pathOption.data)
      .attr(this.option.pathOption.attr);
    let lightning = this.svgObj.paper
      .path(this.option.lightningOption.data)
      .attr(this.option.lightningOption.attr);
    let byq = this.svgObj.g(polyline, path, lightning).attr({
      cursor: "pointer"
    });
    return byq;
  }
}
export default BYQ;
