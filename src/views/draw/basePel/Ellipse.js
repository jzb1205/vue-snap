/**
 *类（椭圆）
 *option Object 创建椭圆所需参数
 * @class Ellipse
 */
class Ellipse {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.cx = option.cx || 0; // 表示中心点的x坐标
    this.cy = option.cy || 0; // 表示中心点的y坐标
    this.rx = option.rx || 0; // 表示椭圆水平方向的半径大小
    this.ry = option.ry || 0; // 表示椭圆垂直方向的半径大小
    this.attr = option.attr || {}; // 样式等属性
  }
  create() {
    let ellipse = this.svgObj.paper
      .ellipse(this.cx, this.cy, this.rx, this.ry)
      .attr(this.attr);
    return ellipse;
  }
}
export default Ellipse;
