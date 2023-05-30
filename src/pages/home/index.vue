<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-03-13 23:43:01
 * @LastEditors: June
 * @LastEditTime: 2023-05-30 12:14:58
-->
<template>
    <div class="home-wrap">
        <!-- 时钟 -->
        <div class="clock-wrap">
            <clock />
        </div>

        <!-- 菜单 -->
        <ul class="menus-wrap">
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
        </ul>
    </div>
</template>

<script lang="ts" setup>
import clock from '@/components/clock/index.vue'
const enptyList = [
    {
        name: '流程图',
        icon: ''
    }
]
</script>

<style lang="scss" scoped>
.home-wrap {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    padding: 10px;
    .clock-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .menus-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .menu-item {
            width: 120px;
            height: 48px;
            border-radius: 8px;
            border: 1px solid #ccc;
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
