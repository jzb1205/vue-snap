/**
 *类（折线）
 *option Object 创建折线所需参数
 * @class Polyline
 */
class Polyline {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.data = option.data || [];
    this.attr = option.attr || {}; // 样式等属性
  }

  create() {
    if (!Array.isArray(this.data)) {
      console.log("参数类型必须为数组类型");
    }
    if (this.data.length % 2 !== 0) {
      console.log("参数数组元素个数需偶数");
    }
    let polyline = this.svgObj.paper.polyline(this.data).attr(this.attr);
    return polyline;
  }
}
export default Polyline;
