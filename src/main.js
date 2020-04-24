import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/element-style/theme/index.css";
import "./assets/reset.css";
Vue.use(ElementUI, { size: "mini", zIndex: 3000 });

import eventReg from "./util/util";
import req from "./../public/config/req.js";

//本地封装方法
Vue.prototype.$eventReg = eventReg; //浏览器事件监听兼容
Vue.prototype.$req = req; 

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
