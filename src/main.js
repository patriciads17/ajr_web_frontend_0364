import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import "@mdi/font/css/materialdesignicons.css";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

Vue.prototype.$api = 'https://ajr-backend.project-patricia.xyz/api';
Vue.prototype.$imgloader = 'https://ajr-backend.project-patricia.xyz/storage/public/';

new Vue({
  vuetify,router,render:(h) => h(App),
}).$mount("#app");
