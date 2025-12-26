/*
 * @Author: June
 * @Description:
 * @Date: 2024-09-12 10:06:07
 * @LastEditTime: 2024-09-12 10:06:57
 * @LastEditors: June
 * @FilePath: \element-fabric-editor\src\store\index.ts
 */
import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

export function setupStore(app: App<Element>) {
  app.use(store)
}

export default store
