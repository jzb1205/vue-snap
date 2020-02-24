/**
 *类（正方形）
 *option Object 创建正方形所需参数
 * @class Rect
 */
class Rect {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.x = option.x || 0; // 左上角x坐标位置
    this.y = option.y || 0; // 左上角y坐标位置
    this.w = option.w || 0; // 宽度
    this.h = option.h || 0; // 高度
    this.rx = option.rx || 0; // 水平方向的圆角大小，默认是0.
    this.ry = option.ry || option.rx || 0; // 垂直方向的圆角大小，默认是rx或0
    this.attr = option.attr || {}; // 样式等属性
  }
  create() {
    let rect = this.svgObj.paper
      .rect(this.x, this.y, this.w, this.h, this.rx, this.ry)
      .attr(this.attr);
    return rect;
  }
}
export default Rect;
