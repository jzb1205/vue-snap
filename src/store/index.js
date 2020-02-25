import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pencelType: "", //画笔类型
    bgColor: "rgba(32, 48, 94, 0.1)" //svg背景颜色
  },
  mutations: {
    changePencelType(state, pload) {
      state.pencelType = pload;
    },
    changebgColor(state, pload) {
      state.bgColor = pload;
    }
  },
  actions: {},
  modules: {}
});
