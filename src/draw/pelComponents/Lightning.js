/**
 *类（闪电符号图元）
 *option Object 创建闪电符号图元所需参数
 * @class Lightning
 */
class Lightning {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.data = option.data || [];
    this.attr = option.attr || {}; // 样式等属性
  }
  create() {
    let lightning = this.svgObj.paper.path(this.data).attr(this.attr);
    return lightning;
  }
}
export default Lightning;
