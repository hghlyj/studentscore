import Vue from 'vue'
import App from './App.vue'

import store from './store'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/icon/index.css'
// import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import './icons' // icon
// import i18n from './lang' // internationalization
//控制页面标题   以及   路径拦截]
//node
import router from './router/node-router'
import './node-permission'

//滚动条
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
    // 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

// import './utils/error-log' // error log
import * as filters from './filters'
// import '../mock'
/**
 *如果你不想使用模拟服务器  
 *你想使用MockJs模拟api  
 *可以执行mockXHR()  
 *
 *目前MockJs将在生产环境中使用，  
 *请在上网前删除它!!!  
 */

// if (process.env.NODE_ENV === 'production') {
//     const { mockXHR } = require('../mock')
//     mockXHR()
// }

//Default   Medium Small Mini

// Vue.use(Element, {
//     size: Cookies.get('size') || 'medium', // set element-ui default size
//     i18n: (key, value) => i18n.t(key, value)
// })

Vue.use(Element, {
    size: Cookies.get('size') || 'Default', // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})



Vue.config.productionTip = false
export const eventBus = new Vue()
new Vue({
    router,
    store,
    render: function(h) { return h(App) }
}).$mount('#app')