<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 23:43:01
 * @LastEditors: June
 * @LastEditTime: 2023-06-25 02:51:42
-->
<template>
    <div class="home-page">
        <div class="grid-wrapper">
            <h3>{{ $t('title.allTools') }}</h3>
            <el-row :gutter="20">
                <el-col :span="6" v-for="tool in toolStore.tools" :key="tool.name">
                    <toolCard :tool="tool" />
                </el-col>
            </el-row>
        </div>
        <!-- 时钟 -->
        <!-- <div class="clock-wrap">
            <clock />
        </div> -->

        <!-- 菜单 -->
        <!-- <ul class="menus-wrap">
            <li class="menu-item">
                <RouterLink to="/flowChart">
                    <span>流程图</span>
                    <svg-icon name="mind" />
                </RouterLink>
            </li>

            <li class="menu-item">
                <RouterLink to="/jsonParse">
                    <li>json 解析</li>
                    <svg-icon name="mind" />
                </RouterLink>
            </li>
        </ul> -->
    </div>
</template>

<script lang="ts" setup>
import toolCard from '@/components/toolCard/index.vue'
import useToolStore from '@/store/modules/tools'
const toolStore = useToolStore()
</script>

<style lang="scss" scoped>
.home-page {
    .grid-wrapper {
        box-sizing: border-box;
        padding: 20px;
        h3 {
            margin-bottom: 10px;
        }
    }
}
</style>
