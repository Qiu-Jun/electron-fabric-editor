/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:59:03
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:46:27
 */
import { isAfter, subWeeks } from 'date-fns'
import type { Tool } from '@/types/tools'

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function defineTool(tool: WithOptional<Tool, 'isNew'>) {
    const isNew = tool.createdAt ? isAfter(tool.createdAt, subWeeks(new Date(), 2)) : false

    return {
        isNew,
        ...tool
    }
}
