/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 02:39:47
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 16:13:48
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/home/index.vue')
    },
    {
        path: '/mind',
        name: 'Mind',
        component: () => import('@/pages/mind/index.vue')
    },
    {
        path: '/update',
        component: () => import('@/pages/update/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
