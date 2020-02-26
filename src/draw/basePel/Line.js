/**
 *类（直线）
 *option Object 创建直线所需参数
 * @class Line
 */
class Line {
  constructor(option) {
    console.log(option);
    this.svgObj = option.svgObj || null;
    this.x1 = option.x1 || 0;
    this.y1 = option.y1 || 0;
    this.x2 = option.x2 || 0;
    this.y2 = option.y2 || 0;
    this.attr = option.attr || {}; // 样式等属性
  }

  create() {
    let line = this.svgObj.paper
      .line(this.x1, this.y1, this.x2, this.y2)
      .attr(this.attr);
    return line;
  }
}
export default Line;
