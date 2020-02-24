/**
 *类（圆）
 *option Object 创建圆所需参数
 * @class Circle
 */
class Circle {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.cx = option.cx || 0; //圆中心坐标x
    this.cy = option.cy || 0; //圆中心坐标y
    this.r = option.r || 0; //圆中半径
    this.attr = option.attr || {}; // 样式等属性
  }
  create() {
    let circle = this.svgObj.paper
      .circle(this.cx, this.cy, this.r)
      .attr(this.attr);
    return circle;
  }
}
export default Circle;
