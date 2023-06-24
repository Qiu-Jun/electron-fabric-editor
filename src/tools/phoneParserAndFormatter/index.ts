/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:55:37
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:08:03
 */
import { Iphone } from '@element-plus/icons-vue'
import { defineTool } from '../tool'

export const tool = defineTool({
    name: 'Phone parser and formatter',
    path: '/phone-parser-and-formatter',
    description:
        'Parse, validate and format phone numbers. Get information about the phone number, like the country code, type, etc.',
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
    createdAt: new Date('2023-05-01')
})
