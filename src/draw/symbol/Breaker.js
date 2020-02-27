/**
 *类（开关）
 *option Object 创建端子所需参数
 * @class terminal
 */
class Breaker {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.attr = option.attr || {
      stroke: "red",
      strokeWidth: 1,
      fill: "none"
    }; // 样式等属性
    this.data = option.data || {
      l1x1: 40,
      l1y1: 40,
      l1x2: 50,
      l1y2: 50,
      l2x1: 50,
      l2y1: 50,
      l2x2: 60,
      l2y2: 40,
      l3x1: 40,
      l3y1: 45,
      l3x2: 50,
      l3y2: 55,
      l4x1: 50,
      l4y1: 55,
      l4x2: 60,
      l4y2: 45,
      l5x1: 50,
      l5y1: 50,
      l5x2: 50,
      l5y2: 65,

      l6x1: 40,
      l6y1: 125,
      l6x2: 50,
      l6y2: 115,
      l7x1: 50,
      l7y1: 115,
      l7x2: 60,
      l7y2: 125,
      l8x1: 40,
      l8y1: 130,
      l8x2: 50,
      l8y2: 120,
      l9x1: 50,
      l9y1: 120,
      l9x2: 60,
      l9y2: 130,
      l0x1: 50,
      l0y1: 120,
      l0x2: 50,
      l0y2: 105,
      x: 40,
      y: 65,
      w: 20,
      h: 40,
      rx: 0,
      ry: 0
    };
  }
  create() {
    let breaker = this.svgObj.paper.el("symbol", {
      id: "Breaker"
    });
    for (let i = 0; i < 10; i++) {
      let line1 = this.svgObj.paper
        .line(
          this.data[`l${i}x1`],
          this.data[`l${i}y1`],
          this.data[`l${i}x2`],
          this.data[`l${i}y2`]
        )
        .attr(this.attr);
      breaker.add(line1);
    }
    let rect = this.svgObj.paper
      .rect(
        this.data.x,
        this.data.y,
        this.data.w,
        this.data.h,
        this.data.rx,
        this.ry
      )
      .attr(this.attr);
    breaker.add(rect);
    return breaker;
  }
}
export default Breaker;
