const click = function(obj) {
  if (obj.type === "circle") {
    obj.drag().animate(
      {
        fill: "red"
      },
      1000
    );
  }
};

export default click;
