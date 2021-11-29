// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

import { VueAxios } from './utils/request'
Vue.use(VueAxios)

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import './utils/directives' //全局自定义指令

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: '4CynGL2PGF0rylfAHeEbaxfCPcetSdHw'
})

import NavTag from './components/GlobalComponent/NavTag.vue';//全局nav导航
Vue.component('NavTag', NavTag);

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import './index.less'
Vue.use(VueAwesomeSwiper)


Vue.config.productionTip = false



import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)



// Vue.prototype.$websocket_url = 'ws://115.29.226.189:6030'//在src/store/modules/real-data.js里还要改 //115.29.226.189 192.168.0.247
// Vue.prototype.$websocket_url = 'ws://192.168.0.247:6030'//在src/store/modules/real-data.js里还要改 //115.29.226.189 192.168.0.247
Vue.prototype.$websocket_url = 'ws://192.168.0.247:8000/moahzsjc/websocket'//在src/store/modules/real-data.js里还要改 //115.29.226.189 192.168.0.247

import echarts from 'echarts';
import 'echarts-gl'
Vue.prototype.$echarts = echarts

import VCharts from 'v-charts'
import 'v-charts/lib/style.css'
Vue.use(VCharts)


new Vue({
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')