/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 21:08:58
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 03:16:25
 */
import { tool as phoneParserAndFormatter } from './phoneParserAndFormatter'
import { tool as jsonDiff } from './jsonDiff'
import type { ToolCategory } from '@/types/tools'

export const toolsByCategory: ToolCategory[] = [
    {
        name: 'Json',
        components: [jsonDiff]
    },
    {
        name: 'Data',
        components: [phoneParserAndFormatter]
    }
]

export const tools = toolsByCategory.flatMap(({ components }) => components)
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
    components.map((tool) => ({ category: name, ...tool }))
)
