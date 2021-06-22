import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import '@/assets/styles/theme/default/styls.scss';

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/antiy.scss' // antiy css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import {
  download
} from '@/utils/request'
import Avue from '@smallwei/avue'
import VueECharts from 'vue-echarts'
import '@smallwei/avue/lib/index.css'

import './assets/icons' // icon
import './permission' // permission control
import {
  getDicts
} from "@/api/system/dict/data";
import {
  getConfigKey
} from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree
} from "@/utils/antiy";
import Pagination from "@/components/Pagination";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar";
// 全局引入echarts

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success"
  });
}

Vue.prototype.msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error"
  });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(Avue, {
  size: "small",
  menuType: "text"
});
Vue.component('v-chart', VueECharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
