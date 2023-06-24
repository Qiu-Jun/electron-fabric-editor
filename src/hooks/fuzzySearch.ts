/*
 * @Descripttion: 模糊搜索
 * @Author: June
 * @Date: 2023-06-24 21:22:45
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 21:24:24
 */
import { type MaybeRef, get } from '@vueuse/core'
import Fuse from 'fuse.js'
import { computed } from 'vue'

export default function useFuzzySearch<Data>({
    search,
    data,
    options = {}
}: {
    search: MaybeRef<string>
    data: Data[]
    options?: Fuse.IFuseOptions<Data>
}) {
    const fuse = new Fuse(data, options)

    const searchResult = computed(() => {
        return fuse.search(get(search)).map(({ item }) => item)
    })

    return { searchResult }
}
