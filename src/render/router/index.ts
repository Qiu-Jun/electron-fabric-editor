/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 18:34:51
 * @LastEditors: June
 * @LastEditTime: 2024-07-24 18:37:15
 * @FilePath: /element-fabric-editor/src/router/index.ts
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './modules/mainRouter'

export default createRouter({
  routes: [...routes],
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})
