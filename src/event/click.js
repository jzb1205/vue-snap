import common from "./../draw/basePel/index";
let a = [];
/**
 *单击事件分装 （连线）
 *@param {Object} svgContent  父级svg对象
 * @param {Object} obj  当前点击对象
 * @returns
 */
const click = function(svgContent, obj) {
  console.log(svgContent);
  console.log(obj.getBBox());
  if (a.length > 2) {
    a.shift();
    a.shift();
  }
  console.log(obj.getBBox());
  a.push(obj.getBBox().cx);
  a.push(obj.getBBox().cy);
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
        stroke: "#000",
        fill: "rgba(0,0,0,0)",
        strokeWidth: 1,
        cursor: "pointer",
        optionType: "polyline"
      }
    };
    new common.Polyline(option).create().click(function() {
      this.drag();
      svgContent.undrag();
    });
    a = [];
  }
};

export default click;
