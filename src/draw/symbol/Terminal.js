/**
 *类（端子）
 *option Object 创建端子所需参数
 * @class terminal
 */
class Terminal {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.cx = option.cx || 50; //圆中心坐标x
    this.cy = option.cy || 50; //圆中心坐标y
    this.r = option.r || 8; //圆中半径
    this.attr = option.attr || {
      stroke: "rgb(0,200,255)",
      strokeWidth: 1,
      fill: "none"
    }; // 样式等属性
  }
  create() {
    let terminal = this.svgObj.paper.el("defs", {
      id: "terminal"
    });
    let circle = this.svgObj.paper
      .circle(this.cx, this.cy, this.r)
      .attr(this.attr);
    terminal.add(circle);
    return terminal;
  }
}
export default Terminal;
