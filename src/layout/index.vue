<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 17:44:29
 * @LastEditors: June
 * @LastEditTime: 2023-06-26 04:07:43
-->
<template>
    <baseLayout>
        <div class="tool-layout">
            <div class="tool-header" v-show="toolTitle">
                <div flex flex-nowrap items-center justify-between>
                    <h1>{{ toolTitle ? $t(toolTitle) : '' }}</h1>

                    <div>
                        <favoriteButton :tool="{ name: route.meta.name } as Tool" />
                    </div>
                </div>

                <div class="separator" />

                <div class="description">
                    {{ toolDescription ? $t(toolDescription) : '' }}
                </div>
            </div>
        </div>

        <div class="tool-content">
            <slot />
        </div>
    </baseLayout>
</template>

<script lang="ts" name="Layout" setup>
import baseLayout from './base.vue'
import favoriteButton from '@/components/favoriteBtn/index.vue'
import type { Tool } from '@/types/tools'

const route = useRoute()
const toolTitle = computed<string>(() => String(route.meta.name))
const toolDescription = computed<string>(() => String(route.meta.description))
</script>

<style lang="scss" scoped>
.tool-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;

    :deep(& > *) {
        flex: 0 1 600px;
    }
}
.tool-layout {
    max-width: 600px;
    margin: 0 auto;
    box-sizing: border-box;

    .tool-header {
        padding: 40px 0;
        width: 100%;

        .n-h1 {
            opacity: 0.9;
            font-size: 40px;
            font-weight: 400;
            margin: 0;
            line-height: 1;
        }

        .separator {
            width: 200px;
            height: 2px;
            background: rgb(161, 161, 161);
            opacity: 0.2;

            margin: 10px 0;
        }

        .description {
            margin: 0;

            opacity: 0.7;
        }
    }
}
</style>
