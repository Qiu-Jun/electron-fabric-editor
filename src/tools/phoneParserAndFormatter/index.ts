/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:55:37
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:10:13
 */
import { Iphone } from '@element-plus/icons-vue'
import { defineTool } from '../tool'

export const tool = defineTool({
    name: 'tools.phoneParse.name',
    path: '/phone-parser-and-formatter',
    description: 'tools.phoneParse.desc',
    keywords: [
        'phone',
        'parser',
        'formatter',
        'validate',
        'format',
        'number',
        'telephone',
        'mobile',
        'cell',
        'international',
        'national'
    ],
    component: () => import('./index.vue'),
    icon: Iphone,
    createdAt: new Date('2023-06-25')
})
