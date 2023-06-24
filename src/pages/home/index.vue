<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 23:43:01
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 23:43:02
-->
<template>
    <div class="home-page">
        <div class="grid-wrapper">
            <n-h3>All the tools</n-h3>
            <el-row :gutter="20">
                <el-col :span="6" v-for="tool in toolStore.tools" :key="tool.name">
                    <transition>
                        <toolCard :tool="tool" />
                    </transition>
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

<style scoped>
.home-page {
    padding-top: 50px;
}

.h3 {
    margin-bottom: 10px;
}

::v-deep(.n-grid) {
    margin-bottom: 30px;
}

.height-enter-active,
.height-leave-active {
    transition: all 0.5s ease-in-out;
    overflow: hidden;
    max-height: 500px;
}

.height-enter-from,
.height-leave-to {
    max-height: 42px;
    overflow: hidden;
    opacity: 0;
    margin-bottom: 0;
}
</style>
