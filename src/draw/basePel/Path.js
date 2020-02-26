/**
 *类（路径）
 *option Object 创建路径所需参数
 * @class Path
 */
class Path {
  constructor(option) {
    this.svgObj = option.svgObj || null;
    this.data = option.data || [];
    this.attr = option.attr || {}; // 样式等属性
  }

  create() {
    let path = this.svgObj.paper.path(this.data).attr(this.attr);
    return path;
  }
}
export default Path;
