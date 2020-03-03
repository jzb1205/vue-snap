const hover = function(id) {
  let obj = document.querySelector(`#${id}`);
  //   let innerSnap = Snap()
  let rectList = obj.selectAll();
  if (obj.type === "circle") {
    obj.drag().animate(
      {
        fill: "red"
      },
      1000
    );
  }
};

export default hover;
