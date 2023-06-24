/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 01:02:44
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 20:12:57
 */
import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'
import directives from './directives/index'
import svgIcon from '@/components/svgIcon/index.vue'
import 'virtual:svg-icons-register'

import 'uno.css'
import './styles/index.scss'
// import 'color-gradient-picker-vue3/dist/style.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'

// 获取所有 SymbolId
// import ids from 'virtual:svg-icons-names'

function runApp() {
    const app = createApp(App)
    app.use(router)
    app.use(store)
    app.component('svg-icon', svgIcon)
    app.use(directives)
    app.mount('#app')
}

runApp()
