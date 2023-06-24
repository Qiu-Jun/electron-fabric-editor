/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 21:08:58
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 21:09:37
 */
import type { ToolCategory } from '@/types/tools'

export const toolsByCategory: ToolCategory[] = []

export const tools = toolsByCategory.flatMap(({ components }) => components)
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
    components.map((tool) => ({ category: name, ...tool }))
)
