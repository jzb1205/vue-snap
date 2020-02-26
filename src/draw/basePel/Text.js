/**
 *类（文本）
 *option Object 创建文本所需参数
 * @class Text
 */
class Text {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.x = option.x || 0; // x坐标位置
    this.y = option.y || 0; // y坐标位置
    this.text = option.text || ""; //文本
    this.attr = option.attr || {}; // 样式等属性
  }
  create() {
    let text = this.svgObj.paper
      .text(this.x, this.y, this.text)
      .attr(this.attr);
    return text;
  }
}
export default Text;
