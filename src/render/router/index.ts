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
  const resetWhiteNameList = ['Login']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => app.use(router)
