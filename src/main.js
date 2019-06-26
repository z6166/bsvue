import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import util from './utils'

import VueCookies from 'vue-cookies'

import 'lib-flexible'

Vue.use(VueCookies);

Vue.use(Antd);

Vue.use(util);

axios.defaults.withCredentials=true;

Vue.prototype.$axios = axios;

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
