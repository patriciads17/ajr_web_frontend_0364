import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import "@mdi/font/css/materialdesignicons.css";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$imgloader = 'http://127.0.0.1:8000/storage/';

new Vue({
  vuetify,router,render:(h) => h(App),
}).$mount("#app");