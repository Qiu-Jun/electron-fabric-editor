<!--
 * @Descripttion:
 * @version:
 * @Author: June
 * @Date: 2023-06-01 10:48:12
 * @LastEditors: June
 * @LastEditTime: 2023-06-01 12:21:22
-->
<template>
    <div class="header-wrap" :style="{ height: props.height }">
        <div class="header-left">
            <RouterLink to="/">
                <div class="title">June Tool</div>
            </RouterLink>
            <slot name="left"></slot>
        </div>
        <div class="header-right">
            <el-button pain v-debounce="onBack">返回</el-button>
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup lang="ts" name="Header">
import { useRouter } from 'vue-router'

interface Ipros {
    height: string
    showBack: boolean
}

const router = useRouter()
const props = withDefaults(defineProps<Ipros>(), {
    height: '100%',
    showBack: true
})

const onBack = () => router.go(-1)
</script>

<style lang="scss" scoped>
a:active {
    color: #333;
}

.header-wrap {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    .header-left {
        display: flex;
        justify-content: flex-start;
        .title {
            font-weight: bolder;
            margin-right: 10px;
        }
    }
    .header-right {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
