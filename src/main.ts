/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-15 22:09:13
 * @LastEditors: June
 * @LastEditTime: 2023-10-28 00:11:35
 */
import { createApp } from 'vue'
import App from './App.vue'
import router, { setupRouter } from './router'
import ViewUiPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import './styles/index.less'
import 'virtual:uno.css'
import VueLazyLoad from 'vue3-lazyload'
// 自定义字体文件
import '@/assets/fonts/font.css'

import i18n from './language/index'

const setupAll = async () => {
    const app = createApp(App)
    setupRouter(app)
    app.use(i18n).use(VueLazyLoad, {}).use(ViewUiPlus)
    await router.isReady()
    app.mount('#app')
}

setupAll()
