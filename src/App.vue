<!--
 * @Author: June
 * @Description:
 * @Date: 2023-03-11 01:03:40
 * @LastEditors: June
 * @LastEditTime: 2023-05-28 17:22:33
-->
<template>
    <el-config-provider :locale="zhCn">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts" name="app">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
