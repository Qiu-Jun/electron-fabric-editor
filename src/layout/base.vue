<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-24 18:20:34
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:14:07
-->
<template>
    <div class="navigation">
        <el-tooltip class="box-item" effect="dark" :content="$t('tips.home')" placement="bottom">
            <el-button :icon="House" circle @click="() => $to('/')"></el-button>
        </el-tooltip>

        <commandPalette />

        <navBarBtns />
    </div>
    <slot />
</template>

<script lang="ts" name="BaseLayout" setup>
import { House } from '@element-plus/icons-vue'
import navBarBtns from './components/navbarBtns.vue'
import commandPalette from '@/components/commandPalette/index.vue'
import useNav from '@/hooks/navTo'

const $to = useNav()
</script>

<style lang="scss" scoped>
.navigation {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding: 20px;

    .search-bar {
        // width: 100%;
        flex-grow: 1;
    }
}
</style>
