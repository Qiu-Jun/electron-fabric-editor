/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 18:34:51
 * @LastEditors: June
 * @LastEditTime: 2024-09-12 09:35:08
 * @FilePath: \element-fabric-editor\src\router\index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './modules/mainRouter'
import type { App } from 'vue'

export const router = createRouter({
  routes: [...routes],
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})

export const resetRouter = (): void => {
  // 当前路由均为静态注册，无需按白名单移除
}

export const setupRouter = (app: App<Element>) => app.use(router)
