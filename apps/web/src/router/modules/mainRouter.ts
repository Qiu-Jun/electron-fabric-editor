/*
 * @Author: June
 * @Description:
 * @Date: 2024-07-24 18:35:48
 * @LastEditors: June
 * @LastEditTime: 2024-09-12 20:36:28
 * @FilePath: \element-fabric-editor\src\router\modules\mainRouter.ts
 */
import type { RouteRecordRaw } from 'vue-router'

import { setToken, autoLogin, logout } from '@/api/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    beforeEnter: async (to: any) => {
      // 自动登录功能
      if (to.query.username && to.query.key) {
        const res = await autoLogin({
          username: to.query.username,
          projectid: to.query.projectid,
          key: to.query.key
        })
        if (res.data.jwt) {
          setToken(res.data.jwt)
        } else {
          logout()
          alert('签名失败')
          window.location.href = '/'
        }
      }
      return true
    },
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/editor/template',
    component: () => import('@/views/template/index.vue')
  }
]

export default routes
