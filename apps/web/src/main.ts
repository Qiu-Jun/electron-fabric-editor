import '@/assets/fonts/font.css'
import '@/styles/index.scss'
// 自定义字体文件
import '@/styles/reset.scss'
import 'color-gradient-picker-vue3/dist/style.css'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import 'wc-waterfall'
import { createApp } from 'vue'
import { setupI18n } from '@/locales/index'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from './store'

async function bootstrap() {
  const app = createApp(App)
  await setupI18n(app)
  await setupRouter(app)
  await setupStore(app)
  await router.isReady()
  app.mount('#app')
}

bootstrap()
