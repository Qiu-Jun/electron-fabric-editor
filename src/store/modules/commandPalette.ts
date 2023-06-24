/*
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 20:58:16
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 21:56:22
 */
import { defineStore } from 'pinia'
import { sample, take, chain } from 'lodash-es'
import { useRouter } from 'vue-router'
import useToolStore from '@/store/modules/tools'
import useFuzzySearch from '@/hooks/fuzzySearch'
import { Search } from '@element-plus/icons-vue'
import type { PaletteOption } from '@/types/commandPalette'

const useCommandPaletteStore = defineStore('command-palette', () => {
    const toolStore = useToolStore()

    const router = useRouter()
    const searchPrompt = ref('')

    const toolsOptions = toolStore.tools.map((tool) => ({
        ...tool,
        to: tool.path,
        toolCategory: tool.category,
        category: 'Tools'
    }))

    const searchOptions: PaletteOption[] = [
        ...toolsOptions,
        {
            name: 'Random tool',
            description: 'Get a random tool from the list.',
            action: () => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const { path } = sample(toolStore.tools)!
                router.push(path)
            },
            icon: Search,
            category: 'Tools',
            keywords: ['random', 'tool', 'pick', 'choose', 'select'],
            closeOnSelect: true
        },
        {
            name: 'Github repository',
            href: 'https://github.com/Qiu-Jun/simple-tool.git',
            category: 'External',
            description: 'View the source code of it-tools on Github.',
            keywords: ['github', 'repo', 'repository', 'source', 'code'],
            icon: Search
        },
        {
            name: 'Report a bug or an issue',
            description: 'Report a bug or an issue to help improve it-tools.',
            href: 'https://github.com/Qiu-Jun/simple-tool.git/issues/new/choose',
            category: 'Actions',
            keywords: ['report', 'issue', 'bug', 'problem', 'error'],
            icon: Search
        }
    ]

    const { searchResult } = useFuzzySearch({
        search: searchPrompt,
        data: searchOptions,
        options: {
            keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
            threshold: 0.3
        }
    })

    const filteredSearchResult = computed(() =>
        chain(searchResult.value)
            .groupBy('category')
            .mapValues((categoryOptions) => take(categoryOptions, 5))
            .value()
    )

    return {
        filteredSearchResult,
        searchPrompt
    }
})

export default useCommandPaletteStore
