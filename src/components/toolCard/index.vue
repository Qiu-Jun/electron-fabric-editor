<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 23:24:11
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 01:08:36
-->
<template>
    <router-link :to="tool.path">
        <div class="tool-card mb-5">
            <div flex items-center justify-between>
                <el-icon class="icon" size="40">
                    <component :is="tool.icon" />
                </el-icon>
                <div flex items-center gap-8px>
                    <!-- <n-tag
                        v-if="tool.isNew"
                        size="small"
                        class="badge-new"
                        round
                        type="success"
                        :bordered="false"
                        :color="{ color: theme.primaryColor, textColor: theme.tagColor }"
                    >
                        New
                    </n-tag> -->

                    <favoriteButton :tool="tool" />
                </div>
            </div>
            <h3 class="title">{{ $t(tool.name) }}</h3>

            <div class="description">
                {{ $t(tool.description) }}
                <br />&nbsp;
            </div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import favoriteButton from '@/components/favoriteBtn/index.vue'
import type { Tool } from '@/types/tools'

const props = defineProps<{ tool: Tool & { category: string } }>()
const { tool } = toRefs(props)
console.log(tool)
</script>

<style lang="scss" scoped>
.tool-card {
    box-sizing: border-box;
    transition: border-color ease 0.5s;
    border-radius: 4px;
    border: 2px solid #ccc;
    padding: 10px;

    &:hover {
        border-color: #409eff;
    }

    .icon {
        opacity: 0.6;
        color: #ccc;
    }

    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ccc;
    }

    .description {
        opacity: 0.6;
        color: #000;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
}
</style>
