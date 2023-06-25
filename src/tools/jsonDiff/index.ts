/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-26 03:05:49
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:13:48
 */
import { Switch } from '@element-plus/icons-vue'
import { defineTool } from '../tool'

export const tool = defineTool({
    name: 'tools.jsonDiff.name',
    path: '/json-diff',
    description: 'tools.jsonDiff.desc',
    keywords: ['json', 'diff', 'compare', 'difference', 'object', 'data'],
    component: () => import('./index.vue'),
    icon: Switch,
    createdAt: new Date('2023-06-26')
})
