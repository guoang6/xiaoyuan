import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import ElementUI from 'element-ui';

//ecahrs
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'

Vue.component('chart', ECharts)
import './assets/css/ali.css'
//粒子特效   npm install vue-particles --save-dev 
import VueParticles from 'vue-particles'  
Vue.use(VueParticles)  
//vuex
import Vuex from 'vuex'
import store from './store'
Vue.use(Vuex)
//导入时间插件
import moment from 'moment';
//定义全局时间过滤器
Vue.filter('dataFormat', function (datastr, pattern = "YYYY-MM-DD HH:mm") {
  return moment(datastr).format(pattern)
})
Vue.config.productionTip = false
// aiox需要的包
import axios from 'axios'
// axios.defaults.withCredentials = true
//aciox基础url
axios.defaults.baseURL = 'http://127.0.0.1:3000';
// axios.defaults.baseURL = 'http://www.guoang.xyz:3000';

//将axios写成vue的原型属性
Vue.prototype.$axios = axios;
//为post请求设置默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//vue2中使用axios，我们请求的参数仍为json类型，是并没有序列化的。我们需要使用querystring解决该问题
import qs from 'qs';
Vue.prototype.qs = qs;

// 添加一个请求拦截器
// http request 拦截器
axios.interceptors.request.use(
  config => {
    let admin_jwt_token =window.localStorage.getItem('admin_jwt_token');
    // console.log(admin_jwt_token)
    config.headers.Authorization = `Bearer ${admin_jwt_token}`;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data && response.data.code) {
    if (parseInt(response.data.code) === 401) {
      //未登录
      ElementUI.Notification({
        title: '警告',
        message: '登录过期请重新登录',
        type: 'warning'
      });
      // store.dispatch('user/deleteuserinfo')//清除用户信息
      router.push('/login');
    }
    if (parseInt(response.data.code) === -1) {
      ElementUI.Notification({
        title: '警告',
        message: '请求失败',
        type: 'warning'
      });
    }
  }
  return response; 
}, function (error) {
  console.log(error)
  // Do something with response error
  console.dir(error);
  ElementUI.Notification({
    title: '警告',
    message: '服务器连接失败',
    type: 'warning'
  });
  return Promise.reject(error);
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
