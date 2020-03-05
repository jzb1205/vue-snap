import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pencelType: "", //画笔类型
    bgColor: "#000", //svg背景颜色
    strokeColor: "red", //画笔颜色
    strokeWidth: 1, //画笔粗细
    fillColor: "#000", //填充颜色
    attrPalToggle: true //属性面板切换
  },
  mutations: {
    changePencelType(state, pload) {
      state.pencelType = pload;
    },
    changebgColor(state, pload) {
      state.bgColor = pload;
    },
    changeStrokeColor(state, pload) {
      state.strokeColor = pload;
    },
    changeStrokeWidth(state, pload) {
      state.strokeWidth = pload;
    },
    changeFillColor(state, pload) {
      state.fillColor = pload;
    },
    changeAttrPalToggle(state, pload) {
      state.attrPalToggle = pload;
    }
  },
  actions: {},
  modules: {}
});
