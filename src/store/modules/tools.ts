/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 21:01:36
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 21:13:58
 */
import { type MaybeRef, get, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { Tool, ToolWithCategory } from '@/types/tools'
import { toolsWithCategory } from '@/tools/index'

const useToolStore = defineStore('tools', {
    state: () => ({
        favoriteToolsName: useStorage('favoriteToolsName', []) as Ref<string[]>
    }),
    getters: {
        favoriteTools(state) {
            return state.favoriteToolsName
                .map((favoriteName) => toolsWithCategory.find(({ name }) => name === favoriteName))
                .filter(Boolean) as ToolWithCategory[] // cast because .filter(Boolean) does not remove undefined from type
        },

        notFavoriteTools(state): ToolWithCategory[] {
            return toolsWithCategory.filter((tool) => !state.favoriteToolsName.includes(tool.name))
        },

        tools(): ToolWithCategory[] {
            return toolsWithCategory
        },

        newTools(): ToolWithCategory[] {
            return this.tools.filter(({ isNew }) => isNew)
        }
    },

    actions: {
        addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
            this.favoriteToolsName.push(get(tool).name)
        },

        removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
            this.favoriteToolsName = this.favoriteToolsName.filter(
                (name) => get(tool).name !== name
            )
        },

        isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
            return this.favoriteToolsName.includes(get(tool).name)
        }
    }
})

export default useToolStore
