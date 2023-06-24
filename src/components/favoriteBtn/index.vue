<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:30:31
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 22:33:04
-->
<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <c-button
                variant="text"
                circle
                :type="buttonType"
                :style="{ opacity: isFavorite ? 1 : 0.2 }"
                @click="toggleFavorite"
            >
                <el-icon><House /></el-icon>
            </c-button>
        </template>
        {{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}
    </n-tooltip>
</template>

<script lang="ts" name="FavoriteButton" setup>
import { House } from '@element-plus/icons-vue'
import useToolStore from '@/store/modules/tools'
import type { Tool } from '@/types/tools'

const props = defineProps<{ tool: Tool }>()

const toolStore = useToolStore()

const { tool } = toRefs(props)

const isFavorite = computed(() => toolStore.isToolFavorite({ tool }))
const buttonType = computed(() => (isFavorite.value ? 'primary' : 'default'))

function toggleFavorite(event: MouseEvent) {
    event.preventDefault()

    if (toolStore.isToolFavorite({ tool })) {
        toolStore.removeToolFromFavorites({ tool })
        return
    }

    toolStore.addToolToFavorites({ tool })
}
</script>
