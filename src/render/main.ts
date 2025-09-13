/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 17:26:12
 * @LastEditors: June
 * @LastEditTime: 2024-12-10 14:56:56
 * @FilePath: \element-fabric-editor\src\main.ts
 */
import '@/assets/fonts/font.css'
import '@/styles/index.scss'
// 自定义字体文件
import '@/styles/reset.scss'
import 'color-gradient-picker-vue3/dist/style.css'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from '@/locales'
import { setupRouter, router } from './router'
import { setupStore } from './store'
import 'wc-waterfall'

async function bootstrap() {
  const app = createApp(App)
  await setupI18n(app)
  await setupRouter(app)
  await setupStore(app)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
