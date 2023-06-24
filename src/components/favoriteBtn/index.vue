<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 22:30:31
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:31:57
-->
<template>
    <el-tooltip trigger="hover">
        <template #content>
            <el-button
                variant="text"
                circle
                :style="{ opacity: isFavorite ? 1 : 0.2 }"
                @click="toggleFavorite"
            >
                <el-icon><House /></el-icon>
            </el-button>
        </template>
        {{ isFavorite ? $t('favorite.remove') : $t('favorite.add') }}
    </el-tooltip>
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
