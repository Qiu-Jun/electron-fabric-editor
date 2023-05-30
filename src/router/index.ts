/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 02:39:47
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 10:41:26
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
        path: '/jsonParse',
        name: 'JsonParse',
        component: () => import('@/pages/jsonParse/index.vue')
    },
    {
        path: '/flowChart',
        name: 'FlowChart',
        component: () => import('@/pages/flowChart/index.vue')
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
