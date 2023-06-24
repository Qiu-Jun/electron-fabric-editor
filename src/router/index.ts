/*
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 02:39:47
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:10:07
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { tools } from '@/tools'

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
    path,
    name,
    component,
    meta: { isTool: true, name, ...config }
}))

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
    },

    ...toolsRoutes
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
