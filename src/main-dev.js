import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import '../src/assets/fonts/iconfont.css'
// 要先导入字体图标再导入样式表
// 导入全局样式表
import '../src/assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本样式表
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入进度条 NPgrogress 对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 在 request 拦截器中，展示进度条 NProgress.start()
// 在 response 拦截器中，隐藏进度条 NProgress.done()

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 通过接口获取菜单数据 
// 添加请求拦截器
axios.interceptors.request.use(config=>{
  NProgress.start();
  //在发送请求之前做某事
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
//添加响应拦截器
axios.interceptors.response.use(config=>{
  //对响应数据做些事
  NProgress.done();
  return config;
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)
// 讲富文本编辑器 注册 为全局可用组件
Vue.use(VueQuillEditor, /* { default global options } */)

// 过滤器 
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal);
  const year = dt.getFullYear();
  const month = (dt.getMonth()+1+'').padStart(2,'0');
  const day = (dt.getDate()+'').padStart(2,'0');
  const hour = (dt.getHours()+'').padStart(2,'0');
  const minute = (dt.getMinutes()+'').padStart(2,'0');
  const second = (dt.getSeconds()+'').padStart(2,'0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
