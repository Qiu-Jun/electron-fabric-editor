/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 02:39:47
 * @LastEditors: June
 * @LastEditTime: 2023-05-22 12:13:06
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
        path: '/update',
        component: () => import('@/pages/update/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
