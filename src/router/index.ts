/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-15 22:09:13
 * @LastEditors: June
 * @LastEditTime: 2023-10-27 23:45:18
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import type { App } from 'vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export const setupRouter = (app: App<Element>) => app.use(router)

export default router
