import common from "./../draw/basePel/index";
let a = [];
/**
 *单击事件分装 （连线）
 *@param {Object} svgContent  父级svg对象
 * @param {Object} obj  当前点击对象
 * @returns
 */
const click = function(svgContent, obj, joinLineType) {
  if (!joinLineType) {
    return;
  }
  if (a.length > 2) {
    a.shift();
    a.shift();
  }
  a.push(obj.getBBox().x);
  a.push(obj.getBBox().y);
  if (a.length === 4 && a[0] !== a[2] && a[1] !== a[3]) {
    let resetA = [
      a[0],
      a[1],
      (a[2] + a[0]) / 2,
      a[1],
      (a[2] + a[0]) / 2,
      a[3],
      a[2],
      a[3]
    ];
    a = [...resetA];
  }
  if (a.length === 2) {
    return a;
  }
  if (a.length > 2) {
    let option = {
      svgObj: svgContent,
      data: a,
      attr: {
        stroke: "red",
        fill: "none",
        strokeWidth: 1,
        cursor: "pointer"
      }
    };
    if (joinLineType.id !== "commonLine") {
      option = {
        svgObj: svgContent,
        data: a,
        attr: {
          stroke: "red",
          fill: "none",
          strokeWidth: 1,
          cursor: "pointer",
          strokeDasharray: joinLineType.dasharray
        }
      };
    }
    new common.Polyline(option).create().click(function(e) {
      e.preventDefault();
      this.drag();
      svgContent.undrag();
    });
    a = [];
  }
};

export default click;
