<!--
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 01:03:40
 * @LastEditors: June
 * @LastEditTime: 2023-06-24 18:29:34
-->
<template>
    <el-config-provider :locale="zhCn">
        <layout>
            <router-view />
        </layout>
    </el-config-provider>
</template>

<script setup lang="ts" name="app">
import layout from '@/layout/index.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// const layout = computed(() => route?.meta?.layout ?? layoutBase)
</script>
