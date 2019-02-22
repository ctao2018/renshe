import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
// 解决300毫秒延迟
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'assets/css/iconfont.css'
import 'common/stylus/index.styl'

import 'assets/css/global.css'
// 移动端调测工具
// import eruda from 'eruda'
// eruda.init()
//引入lib-flexible
import 'lib-flexible/flexible'
import { AlertPlugin, ToastPlugin } from 'vux'
import 'assets/css/app.css'
import infiniteScroll from 'vue-infinite-scroll'
import router from './router'
Vue.use(infiniteScroll)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.config.productionTip = false
Vue.use(ToastPlugin, {position: 'middle'})
fastclick.attach(document.body)

Vue.use(MintUI)

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
